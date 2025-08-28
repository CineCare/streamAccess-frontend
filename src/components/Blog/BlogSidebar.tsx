
import React from "react";
import { BlogPost } from "../../data/mockBlogPosts";
import ArticleIcon from "@mui/icons-material/Article";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

interface BlogSidebarProps {
  posts: BlogPost[];
  onSelect: (id: number) => void;
  selectedId?: number;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ posts, onSelect, selectedId }) => {
  return (
    <Paper elevation={2} sx={{ width: { xs: '100%', md: 260 }, minHeight: 400, p: 2, borderRadius: 2, bgcolor: 'background.default', flexShrink: 0 }} aria-label="Liste des billets du blog">
      <Typography variant="h6" color="primary" fontWeight={600} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
        <ArticleIcon fontSize="medium" sx={{ opacity: 0.8 }} />
        TOUS LES BILLETS
      </Typography>
      <List>
        {posts.map(post => (
          <ListItem key={post.id} disablePadding>
            <ListItemButton
              selected={selectedId === post.id}
              onClick={() => onSelect(post.id)}
              aria-current={selectedId === post.id ? "page" : undefined}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ArticleIcon fontSize="small" sx={{ opacity: 0.7, color: 'text.primary' }} />
              </ListItemIcon>
              <ListItemText primary={post.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BlogSidebar;
