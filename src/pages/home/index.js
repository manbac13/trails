import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { heritage_sites } from "../../utils/data";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import customIcon from "../../assets/LocationTick.svg";
import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  createTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Add } from "iconsax-react";

function DynamicMarker({ site, onClick }) {
  const map = useMap();
  const [iconSize, setIconSize] = useState(10); // Initial icon size

  useEffect(() => {
    if (!map) return;
    const handleZoom = () => {
      const currentZoom = map.getZoom();
      const newIconSize = Math.min(10 + (currentZoom - 2) * 2, 50); // Adjust zoom logic
      setIconSize(newIconSize);
    };

    // Call the resize logic when zoom changes
    handleZoom();
    map.on("zoomend", handleZoom);

    // Cleanup listener
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  // Create a custom icon with dynamic size

  const customIconImage = new L.Icon({
    iconUrl: customIcon,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize],
  });

  return (
    <Marker position={[site.latitude, site.longitude]} icon={customIconImage}>
      <Popup>
        <Stack direction={"column"} sx={{ p: 0 }} spacing={1}>
          <Typography
            component="div"
            dangerouslySetInnerHTML={{
              __html: site.name,
            }}
            sx={{ fontWeight: "600" }}
          />
          <Button variant="contained" size="small" onClick={onClick}>
            See More
          </Button>
        </Stack>
      </Popup>
    </Marker>
  );
}

const Home = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const handleDialogOpen = (site) => {
    setSelectedSite(site);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSite(null);
  };

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
  });
  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {heritage_sites.map((site, index) => (
          <DynamicMarker
            key={index}
            site={site}
            onClick={() => handleDialogOpen(site)}
          />
        ))}
      </MapContainer>

      <ThemeProvider theme={theme}>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                component="div"
                dangerouslySetInnerHTML={{
                  __html: `${selectedSite?.name}  (${selectedSite?.country_name})`,
                }}
                sx={{ fontWeight: "600" }}
              />
              <IconButton size="small" onClick={handleDialogClose}>
                <Add style={{ rotate: "45deg" }} size="20" color="#fff" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ pb: 4 }}>
            <Stack spacing={1}>
              <Typography
                component="div"
                dangerouslySetInnerHTML={{
                  __html: selectedSite?.short_description,
                }}
                sx={{ textAlign: "justify" }}
              />
              <Stack display={"flex"} alignItems={"flex-start"}>
                <Chip
                  label={selectedSite?.category_long}
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: "4px" }}
                />
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default Home;
