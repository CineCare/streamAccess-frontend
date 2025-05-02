import React from "react";
import { Box, Typography, Button } from "@mui/material";

const CommentManagement: React.FC = () => {
  return (
    <Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Gestion des commentaires
      </Typography>
      <Button variant="contained" color="primary" fullWidth>
        Voir les commentaires
      </Button>
    </Box>
  );
};

export default CommentManagement;
