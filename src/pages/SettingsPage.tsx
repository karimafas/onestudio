import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import "./SettingsPage.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { ApiHelper } from "../helpers/ApiHelper";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import {
  TypesDrawer,
  TypesDrawerType,
  TypesSubmittedData,
} from "../components/TypesDrawer";
import { reloadTypes } from "../features/data/dataSlice";

export function SettingsPage() {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [drawerType, setDrawerType] = useState<TypesDrawerType>(
    TypesDrawerType.category
  );
  const user = useAppSelector((state) => state.data.user);
  const categories: Array<Category> = useAppSelector(
    (state) => state.data.categories
  );
  const locations: Array<StudioLocation> = useAppSelector(
    (state) => state.data.locations
  );
  const dispatch = useAppDispatch();

  function _openDrawer(type: TypesDrawerType) {
    setDrawerType(type);
    setDrawer(true);
  }

  async function _submit(data: TypesSubmittedData) {
    let success = await ApiHelper.createType(data.name, drawerType);

    if (success) {
      await dispatch(reloadTypes());
      setDrawer(false);
    }
  }

  return (
    <div className="settings__padding">
      <Drawer
        transitionDuration={300}
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        <TypesDrawer
          type={drawerType}
          submit={(data: TypesSubmittedData) => _submit(data)}
        />
      </Drawer>
      <Typography variant="h5" fontWeight="bold">
        {user?.firstName ?? ""} {user?.lastName ?? ""}
      </Typography>
      <Typography color="#666666">{user?.email ?? ""}</Typography>
      <Typography color="#666666">Studio Manager</Typography>
      <Typography color="#666666" mb={5}>
        One Studio Inc.
      </Typography>
      <Button
        color="error"
        variant="outlined"
        onClick={() => ApiHelper.logout()}
      >
        <LogoutIcon fontSize="small" sx={{ marginRight: "0.3em" }} />
        Log Out
      </Button>
      <Divider sx={{ marginTop: "2em", marginBottom: "2em" }} />
      <div className="settings__row">
        <div className="settings__col">
          <Typography mb={2} fontSize={18} fontWeight="bold">
            Locations
            <IconButton
              onClick={() => _openDrawer(TypesDrawerType.location)}
              component="label"
              sx={{ marginLeft: "0.25em" }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Typography>
          <List dense={true} className="settings__list">
            {locations.map((l) => (
              <ListItem>
                <ListItemText primary={l.name} />
                <IconButton component="label" sx={{ marginLeft: "0.25em" }}>
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
        <Divider sx={{ marginRight: "1em", marginLeft: "1em" }} />
        <div className="settings__col">
          <Typography mb={2} fontSize={18} fontWeight="bold">
            Categories
            <IconButton
              onClick={() => _openDrawer(TypesDrawerType.category)}
              component="label"
              sx={{ marginLeft: "0.25em" }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Typography>
          <List dense={true} className="settings__list">
            {categories.map((c) => (
              <ListItem>
                <ListItemText primary={c.name} />
                <IconButton component="label" sx={{ marginLeft: "0.25em" }}>
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}
