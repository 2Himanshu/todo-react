import React, { useEffect } from "react";
import "../App.css";
import { useState } from "react";
import { app, database, upload } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  Grid,
  Avatar,
} from "@material-ui/core";

import userDataService from "../Service/firebaseService";
function UserProfile() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [emailID, setEmailID] = useState(null);
  const [photoURL, setPhotoURL] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/007/033/146/small/profile-icon-login-head-icon-vector.jpg"
  );
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  //   const dbInstance = collection(database,'users');
  const handleInputs = (event) => {
    let inputs = { [event.target.name]: event.target.value };
    setData({ ...data, ...inputs });
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const getUsers = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = userDataService.getUser();

        console.log(auth.currentUser.email);
        setEmailID(auth.currentUser.email);
        getDoc(docRef).then((doc) => {
          if (doc.exists()) {
            setUsers({ ...doc.data(), id: doc.id });
          } else {
            console.log("No such document!");
          }
        });
      }
    });
  };

  const handleClick = () => {
    upload(photo, auth.currentUser, setLoading);
  };

  useEffect(() => {
    setTimeout(() => {
      if (auth.currentUser?.photoURL) {
        setPhotoURL(auth.currentUser.photoURL);

        getUsers();
      }
    }, 2500);
    getUsers();
  }, [auth.currentUser]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Card
        style={{
          textAlign: "center",
          border: "1px solid black",
          marginLeft: "30%",
          marginTop: "5%",
          marginRight: "30%",
          paddingBottom: "3%",
          width: "50%",
        }}
      >
        <Typography variant="h4" style={{ marginTop: "3%" }}>
          Update Profile
        </Typography>
        <Box
          style={{
            textAlign: "center",
            marginLeft: "20%",
            marginTop: "5%",
            marginRight: "20%",
          }}
        >
          <Grid container justify="center" alignItems="center">
            <Avatar
              style={{ width: 100, height: 100 }}
              size="large"
              alt="Remy Sharp"
              src={photoURL}
            />
          </Grid>
          <input
            type={"file"}
            onChange={handleChange}
            style={{ marginTop: "7%" }}
          />
        </Box>
        <Box
          style={{
            textAlign: "center",
            marginLeft: "20%",
            marginTop: "5%",
            marginRight: "20%",
          }}
        >
          <Typography
            variant="h4"
            style={{ marginTop: "3%", fontSize: "22px" }}
          >
            <span style={{ fontWeight: "bold" }}> Name:</span> {users.name}
          </Typography>
          <Typography
            variant="h4"
            style={{ marginTop: "3%", fontSize: "22px" }}
          >
            <span style={{ fontWeight: "bold" }}> Contact:</span>{" "}
            {users.contact}
          </Typography>
          <TextField
            required
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(event) => handleInputs(event)}
            name="email"
            value={emailID}
            disabled
          />
        </Box>

        <Box display="flex" flexDirection="row" style={{ marginTop: "%" }}>
          <Button
            variant="outlined"
            style={{ marginTop: "3%", marginLeft: "35%" }}
            color="secondary"
            onClick={() => {
              navigate("/home");
            }}
          >
            TODO
          </Button>
          <Button
            variant="contained"
            style={{ marginTop: "3%", marginLeft: "10%" }}
            color="primary"
            onClick={() => {
              handleClick();
            }}
          >
            UPLOAD
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default UserProfile;
