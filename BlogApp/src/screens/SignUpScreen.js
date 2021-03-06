import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Card } from "react-native-elements";
import { FontAwesome, Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { storeDataJSON } from "../functions/AsyncStorageFunctions";
import * as firebase from "firebase";
import Loading from "../components/Loading";
import "firebase/firestore";

const SignUpScreen = (props) => {
	const [Name, setName] = useState("");
	const [SID, setSID] = useState("");
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const [Bod, setBod] = useState("");
	const [Address, setAddress] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	if (isLoading) {
		return <Loading />;
	} else {
		return (
			<View style={styles.viewStyle}>
				<Card>
					<Card.Title>The Office</Card.Title>
					<Card.Divider />
					<Input
						leftIcon={<Ionicons name="ios-person" size={24} color="black" />}
						placeholder="Name"
						onChangeText={function (currentInput) {
							setName(currentInput);
						}}
					/>
					<Input
						leftIcon={<Ionicons name="ios-school" size={24} color="black" />}
						placeholder="Student ID"
						onChangeText={function (currentInput) {
							setSID(currentInput);
						}}
					/>
					<Input
						leftIcon={<FontAwesome name="envelope" size={24} color="black" />}
						placeholder="E-mail Address"
						onChangeText={function (currentInput) {
							setEmail(currentInput);
						}}
					/>

					<Input
						placeholder="Password"
						leftIcon={<Feather name="key" size={24} color="black" />}
						secureTextEntry={true}
						onChangeText={function (currentInput) {
							setPassword(currentInput);
						}}
          />
           <Input
            leftIcon={<FontAwesome name="envelope" size={24} color="black" />}
            placeholder="Bod"
            onChangeText={function (currentInput) {
              setBod(currentInput);
            }}
          />

         
					<Input
						placeholder="Address"
						leftIcon={<Feather name="key" size={24} color="black" />}
						onChangeText={function (currentInput) {
							setAddress(currentInput);
						}}
					/>

					<Button
						icon={<AntDesign name="user" size={24} color="white" />}
						title="  Sign Up!"
						type="solid"
						onPress={() => {
							if (Name && SID && Email && Password && Bod && Address) {
								setIsLoading(true);
								firebase
									.auth()
									.createUserWithEmailAndPassword(Email, Password)
									.then((userCreds) => {
										userCreds.user.updateProfile({ displayName: Name });
										firebase
											.firestore()
											.collection("users")
											.doc(userCreds.user.uid)
											.set({
												name: Name,
												sid: SID,
												email: Email,
												bod: Bod,
												address: Address,
											})
											.then(() => {
												setIsLoading(false);
												alert(userCreds.user.uid);
												console.log(userCreds.user);
												props.navigation.navigate("SignIn");
											})
											.catch((error) => {
												setIsLoading(false);
												alert(error);
											});
									})
									.catch((error) => {
										setIsLoading(false);
										alert(error);
									});
							} else {
								alert("fields cannot be empty!");
							}
						}}
					/>
					<Button
						type="clear"
						icon={<AntDesign name="login" size={24} color="dodgerblue" />}
						title="  Already have an account?"
						onPress={function () {
							props.navigation.navigate("SignIn");
						}}
					/>
				</Card>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	viewStyle: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#4bacb8",
	},
});
export default SignUpScreen;