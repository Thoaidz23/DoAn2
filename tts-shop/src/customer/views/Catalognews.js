import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/catalognews.scss";
import Newbar from "../component/Newbar.js";

function Catalognews() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/catalognews/all')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      });
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4);
  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const vnTime = new Date(date.getTime()); // Cộng 7 tiếng
  
    const day = vnTime.getDate().toString().padStart(2, '0');
    const month = (vnTime.getMonth() + 1).toString().padStart(2, '0');
    const year = vnTime.getFullYear();
    const hours = vnTime.getHours().toString().padStart(2, '0');
    const minutes = vnTime.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  return (
    <div>
      <div className="Catalognews_container">
        <div className="container">
          <h2>BÀI VIẾT MỚI</h2>
        </div>
      </div>

      <div className="content-catalognews">
        <div className="container">
          {featuredPost && (
            <div className="left-news">
              <Link to={`/postdetail/${featuredPost.id_post}`}>
                <img src={`http://localhost:5000/images/post/${featuredPost.image}`} alt={featuredPost.title} />
                <div className="overlay-text">
                  <h3>{featuredPost.title}</h3>
                  <p>{featuredPost.desc_post}</p>
                  <div className="meta">
                    <span className="author">👤 {featuredPost.author}</span>
                    <span className="time">🕒 {formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="right-news">
            {otherPosts.map(post => (
              <div className="small-news" key={post.id_post}>
                <Link to={`/PostDetail/${post.id_post}`}>
                  <img src={`http://localhost:5000/images/post/${post.image}`} alt={post.title} />
                </Link>
                <div className='postcontent'>
                  <Link to={`/PostDetail/${post.id_post}`}>
                    <h4>{post.title}</h4>
                  </Link>
                  <div className="meta">
                    <span>👤 {post.author}</span>
                    <span>🕒 {formatDate(post.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='container-allnews'>
        <Newbar />
      </div>
    </div>
  );
}

export default Catalognews;