import React from "react";
import { Box, Grid, Typography, Paper, useTheme } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import MovieManagement from "../../components/ContentManagement/MovieManagement";
import TagManagement from "../../components/ContentManagement/TagManagement";
import CommentManagement from "../../components/ContentManagement/CommentManagement";
import PersonManagement from "../../components/ContentManagement/PersonManagement";

const ContentManagement: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 3, backgroundColor: theme.palette.background.default}}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            marginBottom: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
            Gestion des contenus
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, marginTop: 1 }}>
            Gérez vos films, tags, commentaires et personnes depuis ce tableau de bord.
          </Typography>
        </Paper>
        <Grid container spacing={3}>
          <Grid size={{ xs:12, sm:6, lg:4 }}>
            <MovieManagement />
          </Grid>
          <Grid size={{ xs:12, sm:6, lg:4 }}>
            <TagManagement />
          </Grid>
          <Grid size={{ xs:12, sm:6, lg:4 }}>
            <CommentManagement />
          </Grid>
          <Grid size={{ xs:12, sm:6, lg:4 }}>
            <PersonManagement />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ContentManagement;
