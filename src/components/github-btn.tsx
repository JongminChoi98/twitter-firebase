import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();

  const uploadImage = async (url: any, storageRef: any) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      const user = auth.currentUser;
      if (user) {
        const imageUrl = user.photoURL;
        const locationRef = ref(storage, `avatars/${user.uid}`);
        await uploadImage(imageUrl, locationRef);
      }
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
