import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  AccountCircle,
  FlightTakeoff,
  Dashboard,
  List,
  Add,
  LightMode,
  DarkMode,
  // Language, // REMOVED: Language icon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
// import { useTranslation } from "react-i18next"; // REMOVED: Import translation hook

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeContext();

  // REMOVED: Translation hook
  // const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // REMOVED: Language Menu state
  // const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // REMOVED: Language Menu Handlers
  // const handleLangMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setLangAnchorEl(event.currentTarget);
  // };

  // const handleLangClose = () => {
  //   setLangAnchorEl(null);
  // };

  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  //   handleLangClose();
  // };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  // Fallback function for removed translation (use hardcoded strings)
  const t = (key: string) => {
    // Return the key itself or a simple string for now
    if (key === "appName") return "Smart Travel Companion";
    if (key === "navbar.dashboard") return "Dashboard";
    if (key === "navbar.myTrips") return "My Trips";
    if (key === "navbar.newTrip") return "New Trip";
    if (key === "navbar.profile") return "Profile";
    if (key === "navbar.logout") return "Logout";
    return key;
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <FlightTakeoff sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          {t("appName")} {/* Using fallback t() */}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate("/dashboard")}
            sx={{
              backgroundColor: isActive("/dashboard")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            {t("navbar.dashboard")} {/* Using fallback t() */}
          </Button>
          <Button
            color="inherit"
            startIcon={<List />}
            onClick={() => navigate("/trips")}
            sx={{
              backgroundColor: isActive("/trips")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            {t("navbar.myTrips")} {/* Using fallback t() */}
          </Button>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate("/create-trip")}
            sx={{
              backgroundColor: isActive("/create-trip")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            {t("navbar.newTrip")} {/* Using fallback t() */}
          </Button>

          {/* --- DARK MODE TOGGLE --- */}
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
          {/* --- END DARK MODE TOGGLE --- */}

          {/* --- REMOVED LANGUAGE SELECTOR --- */}
          {/* <IconButton
            onClick={handleLangMenu}
            color="inherit"
            aria-label="language selector"
          >
            <Language />
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLangClose}
          >
            <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
            <MenuItem onClick={() => changeLanguage("hi")}>Hindi</MenuItem>
          </Menu> 
          */}
          {/* --- END REMOVED LANGUAGE SELECTOR --- */}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user.avatar ? (
              <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>{t("navbar.profile")}</MenuItem>
            <MenuItem onClick={handleLogout}>{t("navbar.logout")}</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
