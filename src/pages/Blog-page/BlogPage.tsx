import React from "react";
import Blog from "../../components/Blog/Blog";
import Navbar from "../../components/Navbar/Navbar";
import Box from "@mui/material/Box";

const BlogPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Blog />
      </Box>
    </Box>
  );
};

export default BlogPage;
