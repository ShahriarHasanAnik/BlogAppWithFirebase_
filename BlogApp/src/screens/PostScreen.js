import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import PostCardComponent from "./../components/PostCardComponent";

import { AuthContext } from "../providers/AuthProvider";

import {
	getDataJSON,
	removeData,
	storeDataJSON,
} from "../functions/AsyncStorageFunctions";
import HeaderComponent from "./../components/HeaderComponent";
import StoreDataComponent from "../components/StoreDataComponent";
import { AsyncStorage } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";

//import React from "react";
import { Button, Input } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
//import { View } from "react-native";

const PostScreen = (props) => {
	const postId = props.route.params.postId;
	//console.log(props);
	const [posts, setPosts] = useState({});
	const [loading, setLoading] = useState(false);
	const [comments, setComments] = useState([]);
	const [input, setInput] = useState([]);
	const [commentID, setCommentID] = useState(0);

	{
		/*const loadIndividualPost = async () => {
			//let response = await getDataJSON(JSON.stringify(postID));
			if (postID != null) {
				return <PostCardComponent author={props.author} body={props.body} />;
			}
		};*/

		/*const getAllData = async () => {
		let data = [];
		try {
			data = await AsyncStorage.getAllKeys();
			if (data != null) {
				return data;
			} else {
				alert("No data with this key!");
			}
		} catch (error) {
			alert(error);
		}
	};
	const getAllComments = async () => {
		let keys = await getAllData();
		let allComments = [];
		try {
			if (keys != null) {
				for (let key of keys) {
					if (key.includes("comment")) {
						let comment = await getDataJSON(key);
						allComments.push(comment);
					}
				}
				return allComments;
			}
		} catch (error) {
			alert(error);
		}
	};*/

		const loadComments = async () => {
			//let response = await getAllComments();
			//let response=
			/*if (response != null) {
			setComments(response);
		}*/
			//setLoading(true);
			firebase
				.firestore()
				.collection("posts")
				.doc(postId)
				.onSnapshot((querySnapshot) => {
					let temp_comments = [];
					querySnapshot.data().comments.forEach((doc) => {
						temp_comments.push(doc);
					});
					setComments(temp_comments);
					setLoading(false);
				})
				.catch((error) => {
					alert(error);
					setLoading(false);
				});
		};

		useEffect(() => {
			loadComments();
		}, []);

		return (
			<AuthContext.Consumer>
				{(auth) => (
					<View style={styles.viewStyle}>
						<HeaderComponent
							DrawerFunction={() => {
								props.navigation.toggleDrawer();
							}}
						/>

						<Card>
							<Card.Title>The post</Card.Title>
							<PostCardComponent
								author={props.route.params.author}
								body={props.route.params.body}
							/>
						</Card>
						<Card>
							<Input
								placeholder="Post a comment"
								leftIcon={<Entypo name="pencil" size={24} color="black" />}
								onChangeText={(currentText) => {
									setComments(currentText);
								}}
							/>
							<Button
								title="Post"
								type="outline"
								onPress={() => {
									firebase
										.firestore()
										.collection("posts")
										.doc(postId)
										.update({
											comments: firebase.firestore.FieldValue.arrayUnion({
												//cid: ["comment" + Math.floor(Math.random() * 255)],
												commenter: auth.CurrentUser.uid,
												comment: comments,
											}),
										})
										.then(() => {
											alert("comment done successfully!");
										})
										.catch((error) => alert(error));
								}}
							/>

						
					
						</Card>

						<ScrollView>
							<Card>
								<Card.Title>Comments for this post</Card.Title>
								<FlatList
									data={comments}
									//onRefresh={loadComments}
									//refreshing={loading}
									renderItem={function ({ item }) {
										/*let data = JSON.parse(item);
									if (JSON.stringify(data.post) === JSON.stringify(postID)) {*/
										//console.log(comments);
										return (
											<View>
												<Card>
													<PostCardComponent
														author={item.comment}
														body={item.commenter}
													/>
												</Card>
											</View>
										);
									}}
								/>
							</Card>
						</ScrollView>
					</View>
				)}
			</AuthContext.Consumer>
		);
	}
};

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 30,
		color: "blue",
	},
	viewStyle: {
		flex: 1,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
	},
});

export default PostScreen;