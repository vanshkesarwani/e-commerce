import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import { FaBars } from "react-icons/fa"; // Menu icon from react-icons

const BottomNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)"); // Check if the screen size is mobile

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      {/* Bottom Navbar */}
      <AppBar position="sticky" sx={{ top: 64, backgroundColor: "#8B0000" }} className="shadow-lg">
        <Toolbar className="flex justify-between items-center">
          {isMobile ? (
            // Menu icon visible only on mobile
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <FaBars size={24} />
            </IconButton>
          ) : (
            <List
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                padding: 0,
              }}
              className="hidden md:flex space-x-4"
            >
              {/* Navigation links visible only on desktop */}
              {[
                 { to: "/men", text: "MEN" },
                 { to: "/women", text: "WOMEN" },
                 { to: "/kids", text: "KIDS" },
                 { to: "/footwear", text: "FOOTWEAR" },
                 { to: "/beauty", text: "BEAUTY" },
                 { to: "/accessories", text: "ACCESSORIES" },
                 { to: "/homeandkitchen", text: "HOME" },
              ].map((item) => (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.to}
                  button
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                    },
                  }}
                  className="text-white hover:text-yellow-400 py-2 px-4 rounded-lg text-center"
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="right" // Drawer opens from the right side
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px", // Adjust width of the drawer
            backgroundColor: "#8B0000",
            color: "white",
            padding: 2,
            borderRadius: "10px 0 0 10px", // Optional: Rounded corners on the left side
          },
        }}
      >
        {/* Drawer content */}
        <List className="space-y-4">
          {[
            { to: "/men", text: "MEN" },
            { to: "/women", text: "WOMEN" },
            { to: "/kids", text: "KIDS" },
            { to: "/footwear", text: "FOOTWEAR" },
            { to: "/beauty", text: "BEAUTY" },
            { to: "/accessories", text: "ACCESSORIES" },
            { to: "/homeandkitchen", text: "HOME" },
          ].map((item) => (
            <ListItem button key={item.text} component={Link} to={item.to} className="text-white hover:bg-gray-800 py-3 px-4 rounded-lg transition-colors duration-300">
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default BottomNavbar;
