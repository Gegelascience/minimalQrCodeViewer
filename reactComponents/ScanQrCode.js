import React, {useState, useEffect} from 'react';
import { Text, View,StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useCameraDevices,Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import Clipboard from '@react-native-clipboard/clipboard';

const ScanQrCode = () => {
    const [textResult, setTextResult] = useState("")
    const [showLinkBtn, setShowLinkBtn] = useState(false)
    const [showClipBtn, setShowClipBtn] = useState(false)

    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices.back;

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
        checkInverted: true,
      });

      useEffect(() => {
        (async () => {
          const status = await Camera.requestCameraPermission();
          setHasPermission(status === 'authorized');
        })();
      }, []);

      useEffect(() => {
        if (barcodes.length > 0 && barcodes[0].displayValue != textResult){
          setTextResult(barcodes[0].displayValue)
          if( barcodes[0].displayValue.startsWith("http://") || barcodes[0].displayValue.startsWith("https://")){
            setShowLinkBtn(true)
          } else {
            setShowLinkBtn(false)
          }
          setShowClipBtn(true)
          
        }

      },[barcodes])


      return (

        <View style={styles.pageContainer}>
          {
            device != null &&
            hasPermission && (
              <View style={{flex:1}}>
                <Camera
                  style={styles.cameraContainer}
                  device={device}
                  isActive={true}
                  frameProcessor={frameProcessor}
                  frameProcessorFps={5}
                />
                <View style={styles.resultContainer}>
                  <Text style={styles.barcodeTextURL}>Valeur du Qr Code:</Text>
                  <Text style={styles.barcodeTextURL}>{textResult}</Text>
                  <View>
                  {showClipBtn && <TouchableOpacity style={[styles.btnAction,styles.clipBtn]} onPress={() => {Clipboard.setString(textResult)}}><Text style={styles.btnText}>Copier la valeur</Text></TouchableOpacity>}
                    {showLinkBtn && <TouchableOpacity style={[styles.btnAction,styles.linkBtn]} onPress={() => {Linking.openURL(textResult)}}><Text style={styles.btnText}>Accès au lien</Text></TouchableOpacity>}
                    
                  </View>
                
                </View>
                
               
              </View>)
          }
          {device == null && (
            <View style={styles.attenteScreen}>
              <Text>En cours de récupération de la caméra</Text>
            </View>
            
          )}
        </View>
        
        
      );
    
    
    
}

const styles = StyleSheet.create({
    barcodeTextURL: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign:"center"
    },
    resultContainer: {
      flex:2,
    },
    btnAction: {
      marginTop:5,
      fontSize: 20,
      minHeight:50,
      justifyContent:"center",
      alignItems:"center",
      borderRadius:15,
    },
    btnText:{
      color:"white"
    },
    clipBtn:{
      backgroundColor:"blue"
    },
    linkBtn:{
      backgroundColor:"green"
    },
    cameraContainer: {
      flex:5,
      position: 'relative',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    pageContainer: {
      flex:1,
    },
    attenteScreen: {
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    }


  });

export default ScanQrCode