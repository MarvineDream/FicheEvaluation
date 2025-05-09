import { Typography, Box } from '@mui/material';

const CompetenceCategory = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">{title}</Typography>
      {items.map((item, index) => (
        <Typography key={index}>- {item.nom} : {item.note}/5</Typography>
      ))}
    </Box>
  );
};

export default CompetenceCategory;
