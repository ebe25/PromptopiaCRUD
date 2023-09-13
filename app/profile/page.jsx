"use client";
import React, {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  console.log("rendering: MyProfile page");

  const {data: session} = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const currSessionUserId = session.user.id;
  const dynamicUserUrl = `api/users/${currSessionUserId}/posts`;

  useEffect(() => {
    const fetchUserPosts = async () => {
      const res = await fetch(dynamicUserUrl);
      const data = await res.json();
      setPosts(data);
    };
    if (currSessionUserId) {
      {
        /* user exists then only call their post */
      }
      fetchUserPosts();
    }
  }, []);

  const handleEdit = (post) => {
    //make sure to pass in posts since -> update-Prompt -> filtering id of posts for form comp
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you Sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((item) => {
          return item._id !== post._id;
        });
        setPosts(filteredPosts);
        console.log("deleted the prompt successfully!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
