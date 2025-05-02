import React from "react";
import { Box, Typography, Button } from "@mui/material";

const TagManagement: React.FC = () => {
  return (
    <Box sx={{ padding: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Gestion des tags
      </Typography>
      <Button variant="contained" color="primary" fullWidth>
        Ajouter un tag
      </Button>
    </Box>
  );
};

export default TagManagement;
