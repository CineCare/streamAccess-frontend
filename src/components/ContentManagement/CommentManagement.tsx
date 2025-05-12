import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

const CommentManagement: React.FC<{ sx?: object }> = ({ sx = {} }) => {
  return (
    <Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1, height: "100%", ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <CommentIcon sx={{ marginRight: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
          Gestion des commentaires
        </Typography>
      </Box>
      <Button variant="contained" color="primary" fullWidth>
        Voir les commentaires
      </Button>
    </Box>
  );
};

export default CommentManagement;
