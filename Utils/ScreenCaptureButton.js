/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {captureScreen} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {Button, useToast, Box, HStack, Image, Text} from 'native-base';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import {Share} from 'react-native';
// import ViewShot from 'react-native-view-shot';
// import Mailer from 'react-native-mail';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const CaptureScreen = props => {
  const toast = useToast();
  // const captureAndSaveScreen = async () => {
  //   // Request storage permission for Android
  //   // if (Platform.OS === 'android' && !(await requestStoragePermission())) {
  //   //     console.log('Storage permission is not granted.');
  //   //     return;
  //   // }

  //   const folderPath = `${RNFS.PicturesDirectoryPath}/payment`;
  //   const fileName = `screenshot_${new Date().toISOString().replace(/:/g, '-')}.jpg`;
  //   const filePath = `${folderPath}/${fileName}`;

  //   // Ensure the folder exists
  //   if (!(await RNFS.exists(folderPath))) {
  //     try {
  //       await RNFS.mkdir(folderPath);
  //     } catch (e) {
  //       console.error('Could not create the folder:', e);
  //     }
  //   }
  // };

  useEffect(() => {
    console.log('REACHED');
    const checkPermission = async () => {
      try {
        console.log('REACHED_ASYNC');
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (!hasPermission) {
          console.log('NOT_HAS_PERMISSION');
          await requestStoragePermission();
        }
      } catch (err) {
        console.warn(err);
      }
    };
    checkPermission();
  }, []);

  const saveImage = async (uri, filePath) => {
    try {
      await RNFS.copyFile(uri, filePath);
      console.log('Screenshot saved to', filePath);
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Screen Capture Successfully to {filePath}
            </Box>
          );
        },
      });
      sendEmailWithScreenshot(filePath);
    } catch (error) {
      console.error('Error saving screenshot:', error);
    }
  };
  const sendEmailWithScreenshot = async filePath => {
    const shareOptions = {
      title: 'Send screenshot via email',
      subject: 'Screenshot',
      message: 'Attached is the screenshot captured from the app.',
      url: `file://${filePath}`,
      type: 'image/jpg',
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error while sharing:', error);
    }
  };

  const captureAndSaveScreen = async () => {
    try {
      const folderPath = `${RNFS.PicturesDirectoryPath}/payment`;
      const fileName = `screenshot_${new Date()
        .toISOString()
        .replace(/:/g, '-')}.jpg`;
      const filePath = `${folderPath}/${fileName}`;

      // Ensure the folder exists
      if (!(await RNFS.exists(folderPath))) {
        try {
          await RNFS.mkdir(folderPath);
        } catch (e) {
          console.error('Could not create the folder:', e);
        }
      }
    } catch (error) {}
    return (
      <Button style={styles.button} onPress={captureAndSaveScreen}>
        <HStack alignItems="center">
          <Text color="#ffffff">{props.text}</Text>
          <Image
            source={require('../Image/icons8-download-64.png')}
            alignItems="center"
            alt="download"
            style={{width: 26, height: 26}}
            resizeMode="contain"
          />
        </HStack>
      </Button>
    );
  };
};

const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to save the screenshot',
      },
    );
    console.log('GRANTED: ', granted);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export default CaptureScreen;

const styles = StyleSheet.create({
  button: {
    height: (screenHeight * 5) / 100,
    borderRadius: (screenHeight * 1.5) / 100,
    margin: 2, // 0.75% of screen width
    backgroundColor: '#560FC9',
  },
});
