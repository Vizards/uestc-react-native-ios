import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Course from './scene/Course';
import Me from './scene/Me';
import Exam from './scene/Exam';
import Card from './scene/Card';

export default TabNavigator(
  {
    Course: { screen: Course },
    Exam: { screen: Exam },
    Card: { screen: Card },
    Me: { screen: Me },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Course') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`;
        } else if (routeName === 'Exam') {
          iconName = `ios-paper${focused ? '' : '-outline'}`;
        } else if (routeName === 'Card') {
          iconName = `ios-card${focused ? '' : '-outline'}`;
        } else if (routeName === 'Me') {
          iconName = `ios-person${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={27} color={tintColor} />;
      },
      tabBarLabel: () => {
        const { routeName } = navigation.state;
        let labelName;
        if (routeName === 'Course') {
          labelName = '课程';
        } else if (routeName === 'Exam') {
          labelName = '考试';
        } else if (routeName === 'Card') {
          labelName = '一卡通';
        } else if (routeName === 'Me') {
          labelName = '我的';
        }

        return labelName;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'rgb(96, 145, 246)',
      inactiveTintColor: 'gray',
      labelStyle: {
        paddingBottom: 2,
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },
);
