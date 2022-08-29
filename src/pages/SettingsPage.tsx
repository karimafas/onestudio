import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import "./SettingsPage.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { ApiHelper } from "../helpers/ApiHelper";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Category } from "../objects/Category";
import { StudioLocation } from "../objects/StudioLocation";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  TypesDrawer,
  TypesDrawerType,
  TypesSubmittedData,
} from "../components/TypesDrawer";
import { reloadTypes, reloadUsers } from "../features/data/dataSlice";
import { TimelineUser } from "../objects/TimelineUser";

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
  const owners: Array<TimelineUser> = useAppSelector((state) =>
    state.data.studioUsers.filter((u) => u.owner)
  );
  const dispatch = useAppDispatch();

  function _openDrawer(type: TypesDrawerType) {
    setDrawerType(type);
    setDrawer(true);
  }

  async function _submit(data: TypesSubmittedData) {
    let success = false;
    if (drawerType === TypesDrawerType.owner) {
      if (!data.userId) return;
      success = await ApiHelper.setOwner(data.userId, data.setOwnerType);

      if (success) {
        await dispatch(reloadUsers());
      }
    } else {
      if (!data.name) return;
      success = await ApiHelper.createType(data.name, drawerType);

      if (success) {
        await dispatch(reloadTypes());
      }
    }

    if (success) setDrawer(false);
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
          <TableContainer component={Paper} sx={{ height: "15em" }}>
            <Table size="small" aria-label="settings locations">
              <TableBody>
                {locations.map((l: StudioLocation) => (
                  <TableRow
                    key={`loc-${l.id}-${l.name}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {l.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          <TableContainer component={Paper} sx={{ height: "15em" }}>
            <Table size="small" aria-label="settings categories">
              <TableBody>
                {categories.map((c: Category) => (
                  <TableRow
                    key={`cat-${c.id}-${c.name}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {c.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Divider sx={{ marginRight: "1em", marginLeft: "1em" }} />
        <div className="settings__col">
          <Typography mb={2} fontSize={18} fontWeight="bold">
            Owners
            <IconButton
              onClick={() => _openDrawer(TypesDrawerType.owner)}
              component="label"
              sx={{ marginLeft: "0.25em" }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Typography>
          <TableContainer component={Paper} sx={{ height: "15em" }}>
            <Table size="small" aria-label="settings categories">
              <TableBody>
                {owners.map((o: TimelineUser) => (
                  <TableRow
                    key={`own-${o.id}-${o.email}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {o.firstName} {o.lastName} ({o.email})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
