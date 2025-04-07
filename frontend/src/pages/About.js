import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Button,
} from '@mui/material';
import {
  School,
  Psychology,
  Diversity3,
  EmojiEvents,
  LinkedIn,
  Email,
} from '@mui/icons-material';

const images = {
  hero: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
  campus: 'https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sbGVnZXxlbnwwfHwwfHx8MA%3D%3D',
  library: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
  team: {
    principal: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    academic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    research: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
};

const About = () => {
  const values = [
    {
      icon: <School fontSize="large" />,
      title: 'Academic Excellence',
      description: 'Committed to the highest standards of education and research',
    },
    {
      icon: <Psychology fontSize="large" />,
      title: 'Innovation',
      description: 'Fostering creativity and technological advancement',
    },
    {
      icon: <Diversity3 fontSize="large" />,
      title: 'Diversity',
      description: 'Embracing different perspectives and cultures',
    },
    {
      icon: <EmojiEvents fontSize="large" />,
      title: 'Achievement',
      description: 'Celebrating success and continuous improvement',
    },
  ];

  const team = [
    {
      name: 'Dr Satyanarayana',
      role: 'Principal',
      image: 'https://res.cloudinary.com/dkz8lerpa/image/',
      bio: '36 years of teaching, Industry, and research experience ',
      social: {
        linkedin: '#',
        email: '@',
      },
    },
    {
      name: 'Prof. S. Durga Prasad',
      role: 'Head of Department',
      image: 'https://bitsvizag.com/cse%20hod.jpg',
      bio: '21 years of teaching ,research and devolepment experience',
      social: {
        linkedin: '#',
        email: '#',
      },
    },
    {
      name: 'B.Madhavarao',
      role: 'Project Guide',
      image: '',
      bio: '',
      social: {
        linkedin: '#',
        email: '',
      },
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '60vh',
          position: 'relative',
          backgroundImage: `url(${images.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container sx={{ position: 'relative', color: 'white', textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h5">
            Shaping the Future Through Education Since 1990
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Mission
            </Typography> 
            <Typography variant="body1" paragraph>
              At Baba Engineering College, we are dedicated to providing world-class education
              that empowers students to become leaders in their chosen fields. Our
              commitment to excellence, innovation, and practical learning sets us apart.
            </Typography>
            <Typography variant="body1">
              We believe in creating an environment where creativity flourishes,
              research thrives, and students are prepared for the challenges of
              tomorrow's world.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                 image={images.campus}
                alt="Campus"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Facilities Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Our Facilities
        </Typography>
        <Card sx={{ position: 'relative', mb: 6 }}>
          <CardMedia
            component="img"
            height="400"
            image={images.library}
            alt="Library"
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              p: 3,
            }}
          >
            <Typography variant="h5" gutterBottom>
               Library
            </Typography>
            <Typography variant="body1">
              Our library houses over 50,000 books and provides access to
              extensive digital resources, creating the perfect environment for
              research and study.
            </Typography>
          </Box>
        </Card>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Leadership Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={member.image}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: 3,
                        borderColor: 'primary.main',
                      }}
                    />
                    <Typography variant="h5" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {member.bio}
                    </Typography>
                    <Box>
                      <Button
                        startIcon={<LinkedIn />}
                        href={member.social.linkedin}
                        target="_blank"
                        sx={{ mr: 1 }}
                      >
                        LinkedIn
                      </Button>
                      <Button
                        startIcon={<Email />}
                        href={`mailto:${member.social.email}`}
                      >
                        Email
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
