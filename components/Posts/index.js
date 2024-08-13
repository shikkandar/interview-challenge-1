// components/Posts.js
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { WindowWidthContext } from '../hooks/useWindowWidth';
import useUserData from '../hooks/useUserData';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { users } = useUserData();
  console.log(users);

  const { isSmallerDevice } = useContext(WindowWidthContext);

  useEffect(() => {
    const fetchPost = async () => {
      const { data: posts } = await axios.get('/api/v1/posts', {
        params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
      });

      const postsWithImages = await Promise.all(
        posts.map(async post => {
          const { data: images } = await axios.get(
            'https://jsonplaceholder.typicode.com/albums/1/photos',
          );
          return { ...post, images };
        }),
      );

      setPosts(postsWithImages);
    };

    fetchPost();
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPage(prevPage => prevPage + 3);
    }, 1000);
  };

  const data = posts.slice(0, page);

  return (
    <Container>
      <PostListContainer>
        {data.map((post, index) => (
          <Post key={post.id} post={post} user={users[index]} />
        ))}
      </PostListContainer>

      {posts.length >= page && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
