import React from "react";
import { Box, useTheme } from "@mui/material";
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
      <Box sx={{ padding: 3, backgroundColor: theme.palette.background.default }}>
        {/* <Paper
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
        </Paper> */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gridTemplateAreas: `
              "movies tags comments"
              "persons tags comments"
            `,
            gap: 3,
          }}
        >
          <Box sx={{ gridArea: "movies", height: "100%", width: "100%" }}>
            <MovieManagement sx={{ height: "100%", width: "100%" }} />
          </Box>
          <Box sx={{ gridArea: "tags", height: "100%", width: "100%" }}>
            <TagManagement sx={{ height: "100%", width: "100%" }} />
          </Box>
          <Box sx={{ gridArea: "comments", height: "100%", width: "100%" }}>
            <CommentManagement sx={{ height: "100%", width: "100%" }} />
          </Box>
          <Box sx={{ gridArea: "persons", height: "100%", width: "100%" }}>
            <PersonManagement sx={{ height: "100%", width: "100%" }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ContentManagement;
