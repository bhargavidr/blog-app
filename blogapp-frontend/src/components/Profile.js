import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProfileEdit from './ProfileEdit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material-UI components and icons
import { Avatar, Button, Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';

export default function Profile() {
    const { user } = useAuth();
    const [isEdit, setIsEdit] = useState(false);
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          {isEdit ? (<ProfileEdit setIsEdit={setIsEdit}/>) : (
          
            <Card style={{ maxWidth: 600, padding: '20px', textAlign: 'center' }}>
                <CardHeader title="Account Info" />
                <CardContent>
                    {user.isLoggedIn ? (
                        <>                        
                            <Avatar
                                alt={user.account.username}
                                // src={`http://localhost:4034/${user.account.profilePicture}`}
                                src={user.account.profilePicture}
                                 sx={{ width: 200, height: 200, margin: '0 auto 20px' }}
                            />
                            
                            <Typography variant="h6" gutterBottom>
                                <AccountCircleIcon style={{ verticalAlign: 'middle' }} />  {user.account.username}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                <EmailIcon style={{ verticalAlign: 'middle' }} /> {user.account.email}
                            </Typography>
                            {user.account.bio && <Typography variant="h6" gutterBottom>
                                <BadgeIcon style={{ verticalAlign: 'middle' }}/> {user.account.bio}
                            </Typography>}
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEdit(true)}
                            >
                                Edit Profile
                            </Button>
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </CardContent>
            </Card>
          )}
            <ToastContainer />
        </div>
    );
}
