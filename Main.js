import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Course from './Course';
import Me from './Me';
import Exam from './Exam';
import Card from './Card';

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
        return <Ionicons name={iconName} size={25} color={tintColor} />;
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
          labelName = '我';
        }

        return labelName;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },
);
