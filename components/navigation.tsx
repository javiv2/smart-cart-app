"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { styled } from "@mui/system"
import Link from "next/link"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}))

const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}))

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Cart
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button color="inherit">
            <NavLink href="/">Home</NavLink>
          </Button>
          <Button color="inherit">
            <NavLink href="/products">Products</NavLink>
          </Button>
          <Button color="inherit">
            <NavLink href="/cart">
              <ShoppingCartIcon sx={{ mr: 0.5 }} />
              Cart
            </NavLink>
          </Button>
        </Box>
      </StyledToolbar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <List>
          <ListItem button onClick={handleDrawerToggle}>
            <NavLink href="/">
              <ListItemText primary="Home" />
            </NavLink>
          </ListItem>
          <ListItem button onClick={handleDrawerToggle}>
            <NavLink href="/products">
              <ListItemText primary="Products" />
            </NavLink>
          </ListItem>
          <ListItem button onClick={handleDrawerToggle}>
            <NavLink href="/cart">
              <ListItemText primary="Cart" />
            </NavLink>
          </ListItem>
        </List>
      </Drawer>
    </StyledAppBar>
  )
}

export default Navigation
