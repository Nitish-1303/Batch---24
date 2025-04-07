import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  styled,
  Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
  color: '#ffffff',
  padding: theme.spacing(15, 0),
  marginBottom: theme.spacing(6),
  borderRadius: '40px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
}));

const ContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '20px',
  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
  color: '#ffffff',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(2),
    fontSize: '2rem',
  },
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon />,
      title: 'Address',
      content: 'Baba college, Lake, near Pothinamallayyapalem, Pothinamallayya Palem, Visakhapatnam, Andhra Pradesh 530041',
      link: 'https://maps.app.goo.gl/4YdGJwHVFGBPGEQx7'
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      content: '089125 69933, 099890 74888',
    },
    {
      icon: <EmailIcon />,
      title: 'Email',
      content: 'info@bitsvizag.com',
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Office Hours',
      content: 'Monday - Saturday: 9:00 AM - 5:00 PM',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Contact Us
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                We're here to help and answer any questions you might have
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="baba college image"
                alt="Baba Campus"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ContactCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Fill out the form below and we'll get back to you as soon as possible
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          py: 2,
                          borderRadius: '10px',
                          fontSize: '1.1rem',
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </ContactCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="white">
                  Contact Information
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, color: 'white' }}>
                  Get in touch with us through any of these channels
                </Typography>
                {contactInfo.map((info, index) => (
                  <IconWrapper key={index}>
                    {info.icon}
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {info.title}
                      </Typography>
                      {info.link ? (
                        <Button
                          variant="text"
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'white',
                            textTransform: 'none',
                            p: 0,
                            '&:hover': {
                              textDecoration: 'underline',
                              backgroundColor: 'transparent'
                            }
                          }}
                        >
                          {info.content}
                        </Button>
                      ) : (
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          {info.content}
                        </Typography>
                      )}
                    </Box>
                  </IconWrapper>
                ))}
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;