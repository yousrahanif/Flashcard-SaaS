'use client'

import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material'
import Head from 'next/head'
import { motion } from 'framer-motion'

export default function Home() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])

  // const handleSubmit = async () => {
  //   const checkoutSession = await fetch('/api/checkout_session', {
  //     method: 'POST',
  //     headers: { origin: 'http://localhost:3000'},
  //   })
  //   const checkoutSessionJson = await checkoutSession.json()
  //   if (checkoutSession.statusCode == 500){
  //     console.error(checkoutSession.message)
  //     return 
  //   }
  
  //   const stripe = await getStripe()
  //   const { error } = await stripe.redirectToCheckout({
  //     sessionId: checkoutSessionJson.id,
  //   })
  
  //   if (error) {
  //     console.warn(error.message)
  //   }
  // }
  const handleSubmit = async (planType) => {
    const response = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000'
      },
      body: JSON.stringify({ planType }), // Send the plan type in the request body
    });
  
    const checkoutSessionJson = await response.json();
  
    if (response.status === 500) {
      console.error(checkoutSessionJson.error.message);
      return;
    }
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  };
  
  // Use handleSubmit with the appropriate plan type when buttons are clicked
  

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content='Create flashcards from your text' />
      </Head>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', my: 6, py: 6, background: 'linear-gradient(to right, #f0f4f8, #d4e0e8)', borderRadius: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
        >
          Welcome to Flashcard SaaS
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ color: 'text.secondary', mb: 4 }}
        >
          The easiest way to create flashcards from your text.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
              borderRadius: 20,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              boxShadow: 3
            }}
            href="/generate"
          >
            Get Started
          </Button>
          {/* Uncomment if you want to use Learn More button */}
          {/* <Button
            variant="outlined"
            color="primary"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { borderColor: 'primary.dark', color: 'primary.dark' },
              borderRadius: 20,
              px: 4,
              py: 1.5,
              textTransform: 'none'
            }}
          >
            Learn More
          </Button> */}
        </Box>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center', backgroundColor: 'grey.100', p: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'secondary.main' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <motion.div variants={featureVariants} initial="hidden" animate="visible">
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, backgroundColor: 'background.paper', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Typography variant='h6' gutterBottom sx={{ color: 'primary.main' }}>
                  Effortless Text Conversion
                </Typography>
                <Typography variant='body1'>
                  Transform your text into flashcards effortlessly. Our intuitive interface ensures a smooth experience, making card creation quick and easy.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <motion.div variants={featureVariants} initial="hidden" animate="visible">
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, backgroundColor: 'background.paper', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Typography variant='h6' gutterBottom sx={{ color: 'primary.main' }}>
                  Intelligent Categorization
                </Typography>
                <Typography variant='body1'>
                  Automatically categorize your flashcards based on content, helping you stay organized and focused on the most important topics.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <motion.div variants={featureVariants} initial="hidden" animate="visible">
              <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, backgroundColor: 'background.paper', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Typography variant='h6' gutterBottom sx={{ color: 'primary.main' }}>
                  Customizable Templates
                </Typography>
                <Typography variant='body1'>
                  Personalize your flashcards with a range of customizable templates. Whether you prefer a minimalist design or a more elaborate style, we have got you.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'secondary.main' }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          {/* Basic Pricing */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, backgroundColor: 'background.paper' }}>
              <Typography variant='h5' gutterBottom sx={{ color: 'success.main' }}>
                Basic
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ color: 'success.dark' }}>
                $5 / Month
              </Typography>
              <Typography variant='body1'>
                Access to Basic Card Features. Perfect for individuals just getting started with flashcards.
              </Typography>
              <Button
  variant='contained'
  color='success'
  sx={{ mt: 2 }}
  onClick={() => handleSubmit('basic')}
>
  Choose Basic
</Button>
            </Box>
          </Grid>

          {/* Pro Pricing */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, backgroundColor: 'background.paper' }}>
              <Typography variant='h5' gutterBottom sx={{ color: 'error.main' }}>
                Pro
              </Typography>
              <Typography variant='h6' gutterBottom sx={{ color: 'error.dark' }}>
                $10 / Month
              </Typography>
              <Typography variant='body1'>
                Access to Advanced Card Features and Priority Support. Ideal for power users and teams.
              </Typography>
              <Button
  variant='contained'
  color='error'
  sx={{ mt: 2 }}
  onClick={() => handleSubmit('pro')}
>
  Choose Pro
</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}




// 'use client'

// import getStripe from '@/utils/get-stripe'
// import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
// import { useState } from 'react'
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   AppBar,
//   Toolbar,
//   Grid,
// } from '@mui/material'
// import Head from 'next/head'

// export default function Home() {
//   const [text, setText] = useState('')
//   const [flashcards, setFlashcards] = useState([])

//   const handleSubmit = async () => {
//     const checkoutSession = await fetch('/api/checkout_session', {
//       method: 'POST',
//       headers: { origin: 'http://localhost:3000'},
//     })
//     const checkoutSessionJson = await checkoutSession.json()
//     if (checkoutSession.statusCode==500){
//       console.error(checkoutSession.message)
//       return 
//     }
  
//     const stripe = await getStripe()
//     const {error} = await stripe.redirectToCheckout({
//       sessionId: checkoutSessionJson.id,
//     })
  
//     if (error) {
//       console.warn(error.message)
//     }
//   }

//   return (
//     <Container maxWidth="md">
//       <Head>
//         <title>
//           Flashcard SaaS
//         </title>
//         <meta name="description" content='Create flashcard from your text'></meta>

//       </Head>
//       <AppBar position="static">
//   <Toolbar>
//     <Typography variant="h6" style={{flexGrow: 1}}>
//       Flashcard SaaS
//     </Typography>
//     <SignedOut>
//       <Button color="inherit" href="/sign-in">Login</Button>
//       <Button color="inherit" href="/sign-up">Sign Up</Button>
//     </SignedOut>
//     <SignedIn>
//       <UserButton />
//     </SignedIn>
//   </Toolbar>
// </AppBar>
// <Box sx={{textAlign: 'center', my: 4}}>
//   <Typography variant="h2" component="h1" gutterBottom>
//     Welcome to Flashcard SaaS
//   </Typography>
//   <Typography variant="h5" component="h2" gutterBottom>
//     The easiest way to create flashcards from your text.
//   </Typography>
//   <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
//     Get Started
//   </Button>
//   <Button variant="outlined" color="primary" sx={{mt: 2}}>
//     Learn More
//   </Button>
// </Box>
// <Box sx={{ my: 6, textAlign: 'center' }}>
//   <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
//   <Grid container spacing={4}>
//     {/* Feature 1 */}
//     <Grid item xs={12} md={4}>
//       <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//         <Typography variant='h6' gutterBottom>
//           Effortless Text Conversion
//         </Typography>
//         <Typography variant='body1'>
//           Transform your text into flashcards effortlessly. Our intuitive interface ensures a smooth experience, making card creation quick and easy.
//         </Typography>
//       </Box>
//     </Grid>

//     {/* Feature 2 */}
//     <Grid item xs={12} md={4}>
//       <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//         <Typography variant='h6' gutterBottom>
//           Intelligent Categorization
//         </Typography>
//         <Typography variant='body1'>
//           Automatically categorize your flashcards based on content, helping you stay organized and focused on the most important topics.
//         </Typography>
//       </Box>
//     </Grid>

//     {/* Feature 3 */}
//     <Grid item xs={12} md={4}>
//       <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//         <Typography variant='h6' gutterBottom>
//           Customizable Templates
//         </Typography>
//         <Typography variant='body1'>
//   Personalize your flashcards with a range of customizable templates. Whether you prefer a minimalist design or a more elaborate style, We have got you.
// </Typography>
//       </Box>
//     </Grid>
//   </Grid>
// </Box>


// <Box sx={{ my: 6, textAlign: 'center' }}>
//   <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
//   <Grid container spacing={4}>
//     {/* Basic Pricing */}
//     <Grid item xs={12} md={6}>
//       <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//         <Typography variant='h5' gutterBottom>
//           Basic
//         </Typography>
//         <Typography variant='h6' gutterBottom>
//           $5 / Month
//         </Typography>
//         <Typography variant='h6'>
//           Access to Basic Card Features. Perfect for individuals just getting started with flashcards.
//         </Typography>
//         <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleSubmit}>Choose Basic</Button>
//       </Box>
//     </Grid>

//     {/* Pro Pricing */}
//     <Grid item xs={12} md={6}>
//       <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//         <Typography variant='h5' gutterBottom>
//           Pro
//         </Typography>
//         <Typography variant='h6' gutterBottom>
//           $10 / Month
//         </Typography>
//         <Typography variant='h6'>
//           Access to Advanced Card Features and Priority Support. Ideal for power users and teams.
//         </Typography>
//         <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
//       </Box>
//     </Grid>
//   </Grid>
// </Box>

      
     
//     </Container>
//   )
// }