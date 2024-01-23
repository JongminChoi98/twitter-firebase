import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import EditTweetForm from "./edit-tweet-form";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid grey;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  width: 70px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  width: 70px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

const DeletePhoto = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-top: 10px;
  &:hover {
    opacity: 0.8;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const AvatarWrapper = styled.label`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 25px;
  }
`;

export default function Tweet({ userId, username, photo, tweet, id }: ITweet) {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    await deleteDoc(doc(db, "tweets", id));
    if (photo) {
      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      await deleteObject(photoRef);
    }
  };

  const onEdit = () => setIsEditing((prev) => !prev);

  const onDeletePhoto = async () => {
    const ok = confirm("Are you sure to delete?");

    if (!ok || user?.uid !== userId) return;

    const tweetRef = doc(db, "tweets", id);
    await updateDoc(tweetRef, {
      photo: deleteField(),
    });
    await deleteObject(ref(storage, `tweets/${user.uid}/${id}`));
    onEdit();
  };

  const fetchAvator = async () => {
    const locationRef = ref(storage, `avatars/${userId}`);
    getDownloadURL(locationRef).then((url: string) => {
      setAvatar(url);
    });
  };

  useEffect(() => {
    fetchAvator();
  }, []);

  return (
    <Wrapper>
      <Column>
        <Row>
          <AvatarWrapper>
            {avatar ? (
              <UserAvatar src={avatar} />
            ) : (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}
          </AvatarWrapper>
          <Username>{username}</Username>
        </Row>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            photo={photo}
            id={id}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <BtnWrap>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={onEdit}>
              {isEditing ? "Cancel" : "Edit"}
            </EditButton>
          </BtnWrap>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
          {isEditing ? (
            <DeletePhoto onClick={onDeletePhoto}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </DeletePhoto>
          ) : null}
        </Column>
      ) : null}
    </Wrapper>
  );
}
