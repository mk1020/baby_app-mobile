инструкция по установке и запуску:
https://reactnative.dev/docs/environment-setup

для запуска: 
1) npx react-native start или yarn start
2) npx react-native run-android/run-ios или yarn run android/ios

ios запускается только на системе Mac OS

За основу взят шаблон https://github.com/osamaqarem/react-native-template/tree/master/template
Но проект создавался с нуля, а из шаблона взята в основном(или только)
папка src.

Обратите внимание на эту либу, когда будете делать)
https://github.com/luggit/react-native-config
todo: 
проверить как работает гугл авторизация на ios, 
настроить watermelonDB на ios
Установка JSI на android

. Когда вы импортируете Watermelon Sync, ваше приложение может не компилироваться в режиме выпуска. Чтобы исправить это, настройте сборщик Metro для использования Terser вместо UglifyES. Запустить: