import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Tip za notifikaciju
interface Notification {
  id: number;

  userId: string;
  message: string;
  createdAt: string; // Koristi string za ISO format datuma
  isRead: boolean;
}

// Tip za stanje
interface NotificationsState {
  notifications: Notification[];
  count:number;
  loading: boolean;
  error: string | null;
}

// Inicijalno stanje
const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  count:0,
};

// Asinhrona akcija za dohvat notifikacija
export const fetchNotifications = createAsyncThunk<
  Notification[],
  string, // userId kao argument
  { rejectValue: string }
>("notifications/fetchNotifications", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:5157/api/Notification/user/${userId}`
    );
    return response.data; // Vrati niz notifikacija
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch notifications");
  }
});

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5157/api/notification/${notificationId}`);
      return response.data; // Vraća obrisanu notifikaciju
    } catch (error) {
      // Proveri da li API vraća detalje greške
      return rejectWithValue(error.response?.data || 'Error deleting notification');
    }
  }
);
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.put(`http://localhost:5157/api/Notification/${notificationId}/mark-as-read`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk za označavanje svih notifikacija kao pročitane
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.put(`http://localhost:5157/api/Notification/user/${userId}/mark-all-as-read`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
      
    },
    addNotification:(state,action:PayloadAction<Notification>)=>{
        state.notifications.push(action.payload);
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.count = action.payload.filter((notification) => !notification.isRead && notification.userId===localStorage.getItem("userId")).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        );
        if (notification) {
          notification.isRead = true;
        }
      })

      // Mark All Notifications As Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.notifications.forEach((notification) => {
          if (!notification.isRead) {
            notification.isRead = true;
          }
        });
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload.id
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete notification';
      });
  },
});

// Ekspozicija akcija i reducera
export const { markAsRead,addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
