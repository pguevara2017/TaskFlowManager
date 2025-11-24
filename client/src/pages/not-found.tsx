import { Card, CardContent, Box, Typography } from "@mui/material";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, mx: 2 }}>
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', mb: 2, gap: 1, alignItems: 'center' }}>
            <AlertCircle size={32} style={{ color: '#ef4444' }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              404 Page Not Found
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Did you forget to add the page to the router?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
