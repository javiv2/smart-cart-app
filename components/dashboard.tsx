"use client"
import { Box, Typography, Grid, Paper, useMediaQuery, useTheme } from "@mui/material"

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Smart Cart!
      </Typography>
      <Typography variant="body1" paragraph>
        Start adding items to your cart and track your spending. Let's make smart shopping decisions together!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Cart Summary
            </Typography>
            <Typography variant="body2">View your current cart total and items.</Typography>
            {/* Add cart summary details here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Spending Insights
            </Typography>
            <Typography variant="body2">Analyze your shopping habits and identify areas for savings.</Typography>
            {/* Add spending insights details here */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom>
              Recent Shopping Activity
            </Typography>
            <Typography variant="body2">Track your recent purchases and cart modifications.</Typography>
            {/* Add recent activity details here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
