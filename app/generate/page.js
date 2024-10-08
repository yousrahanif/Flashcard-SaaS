'use client'

import { useState } from 'react'
import { db } from '@/firebase'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CardContent,
  Card,
  Grid,
  CardActionArea,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress, // Import CircularProgress for loading indicator
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
import Swal from 'sweetalert2'

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false) // Add loading state
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true) // Start loading
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data)
        setLoading(false) // Stop loading
      })
      .catch(() => {
        setLoading(false) // Stop loading in case of error
      })
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    if (!isSignedIn) {
      Swal.fire({
        title: 'Please log in',
        text: 'You need to be logged in to save flashcards.',
        icon: 'warning',
        confirmButtonText: 'Log In',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/sign-in') // Redirect to the sign-in page
        }
      })
    } else {
      setDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    setLoading(true) // Start loading
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === setName)) {
        alert('A flashcard collection with the same name already exists')
        setLoading(false) // Stop loading
        return
      } else {
        collections.push({ name: setName })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name: setName }] })
    }

    const colRef = collection(userDocRef, setName)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    setLoading(false) // Stop loading
    handleCloseDialog()
    router.push('/flashcards')
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Generate Flashcards
        </Typography>
        <Paper
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '600px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{
              padding: '12px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
        >
          <CircularProgress size={60} /> {/* Show loading spinner */}
        </Box>
      )}

      {flashcards.length > 0 && !loading && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }}>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: '100px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                backgroundColor: '#3f51b5',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
              variant="contained"
              color="primary"
              onClick={handleOpen}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          {isSignedIn && (
            <>
              <DialogContentText>Please enter a name for your flashcard set.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                type="text"
                fullWidth
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {isSignedIn && (
            <Button onClick={saveFlashcards} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  )
}




// 'use client'

// import { useState } from 'react'
// import { db } from '@/firebase'
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   CardContent,
//   Card,
//   Grid,
//   CardActionArea,
//   DialogActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
// } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import { useUser } from '@clerk/nextjs'
// import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
// import Swal from 'sweetalert2'


// export default function Generate() {
//   const { isLoaded, isSignedIn, user } = useUser()
//   const [text, setText] = useState('')
//   const [flashcards, setFlashcards] = useState([])
//   const [flipped, setFlipped] = useState({})
//   const [setName, setSetName] = useState('')
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async () => {
//     fetch('api/generate', {
//       method: 'POST',
//       body: text,
//     })
//       .then((res) => res.json())
//       .then((data) => setFlashcards(data))
//   }

//   const handleCardClick = (id) => {
//     setFlipped((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }))
//   }

//   const handleOpen = () => {
//     setDialogOpen(true)
//   }

//   const handleCloseDialog = () => {
//     setDialogOpen(false)
//   }

//   const saveFlashcards = async () => {
//     if (!isSignedIn) {
//       Swal.fire({
//         title: 'Please log in',
//         text: 'You need to be logged in to save flashcards.',
//         icon: 'warning',
//         confirmButtonText: 'Log In',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           router.push('/sign-in') // Redirect to the sign-in page
//         }
//       })
//       return
//     }
  
//     if (!setName.trim()) {
//       alert('Please enter a name for your flashcard set.')
//       return
//     }
  
//     const batch = writeBatch(db)
//     const userDocRef = doc(collection(db, 'users'), user.id)
//     const docSnap = await getDoc(userDocRef)
  
//     if (docSnap.exists()) {
//       const collections = docSnap.data().flashcards || []
//       if (collections.find((f) => f.name === setName)) {
//         alert('A flashcard collection with the same name already exists')
//         return
//       } else {
//         collections.push({ name: setName })
//         batch.set(userDocRef, { flashcards: collections }, { merge: true })
//       }
//     } else {
//       batch.set(userDocRef, { flashcards: [{ name: setName }] })
//     }
  
//     const colRef = collection(userDocRef, setName)
//     flashcards.forEach((flashcard) => {
//       const cardDocRef = doc(colRef)
//       batch.set(cardDocRef, flashcard)
//     })
  
//     await batch.commit()
//     handleCloseDialog()
//     router.push('/flashcards')
//   }
  

//   return (
//     <Container maxWidth="md">
//       <Box
//         sx={{
//           mt: 4,
//           mb: 6,
//           minHeight: '60vh',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
//           Generate Flashcards
//         </Typography>
//         <Paper
//           sx={{
//             p: 4,
//             width: '100%',
//             maxWidth: '600px',
//             borderRadius: '15px',
//             boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
//           }}
//         >
//           <TextField
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             label="Enter Text"
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             sx={{ mb: 3 }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//             fullWidth
//             sx={{
//               padding: '12px 0',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               borderRadius: '8px',
//               backgroundColor: '#3f51b5',
//               '&:hover': {
//                 backgroundColor: '#303f9f',
//               },
//             }}
//           >
//             Submit
//           </Button>
//         </Paper>
//       </Box>

//       {flashcards.length > 0 && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
//             Flashcards Preview
//           </Typography>
//           <Grid container spacing={3}>
//             {flashcards.map((flashcard, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Card sx={{ borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }}>
//                   <CardActionArea onClick={() => handleCardClick(index)}>
//                     <CardContent>
//                       <Box
//                         sx={{
//                           perspective: '100px',
//                           '& > div': {
//                             transition: 'transform 0.6s',
//                             transformStyle: 'preserve-3d',
//                             position: 'relative',
//                             width: '100%',
//                             height: '200px',
//                             boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
//                             transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
//                           },
//                           '& > div > div': {
//                             position: 'absolute',
//                             width: '100%',
//                             height: '100%',
//                             backfaceVisibility: 'hidden',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             padding: 2,
//                             boxSizing: 'border-box',
//                           },
//                           '& > div > div:nth-of-type(2)': {
//                             transform: 'rotateY(180deg)',
//                           },
//                         }}
//                       >
//                         <div>
//                           <div>
//                             <Typography variant="h5" component="div">
//                               {flashcard.front}
//                             </Typography>
//                           </div>
//                           <div>
//                             <Typography variant="h5" component="div">
//                               {flashcard.back}
//                             </Typography>
//                           </div>
//                         </div>
//                       </Box>
//                     </CardContent>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//           <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>


         



//             <Button
//               sx={{
//                 padding: '10px 24px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 backgroundColor: '#3f51b5',
//               '&:hover': {
//                 backgroundColor: '#303f9f',
                
//                 },
//               }}
//               variant="contained"
//               color="primary"
//               onClick={handleOpen}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       )}

//       <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle>Save Flashcard Set</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Please enter a name for your flashcard set.</DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Set Name"
//             type="text"
//             fullWidth
//             value={setName}
//             onChange={(e) => setSetName(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={saveFlashcards} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }



// 'use client'

// import { useState } from 'react'
// import { db } from '@/firebase'
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   CardContent,
//   Card,
//   Grid,
//   CardActionArea,
//   DialogActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
// } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import { useUser } from '@clerk/nextjs'
// import { doc, collection, setDoc, getDoc, writeBatch  } from 'firebase/firestore'


// export default function Generate() {
//     const { isLoaded, isSignedIn, user } = useUser()
//   const [text, setText] = useState('')
//   const [flashcards, setFlashcards] = useState([])
//   const [flipped, setFlipped] = useState({})
//   const [setName, setSetName] = useState('')
// const [dialogOpen, setDialogOpen] = useState(false)
// const router =useRouter
  

// const handleSubmit = async () => {
//      fetch('api/generate', {
//       method: 'POST',
//       body:text,
     
//     })
//     .then((res)=>res.json())
//     .then((data) => setFlashcards(data))
//   }
// const handleCardClick=(id)=>{
//   setFlipped((prev)=>({
//     ...prev,
//     [id]:!prev[id],
//   }))
// }
//  const handleOpen=()=>{
//   setDialogOpen(true)

//  }
//  const handleCloseDialog=()=>{
//   setDialogOpen(false)

//  }
//  const saveFlashcards = async () => {
//   if (!setName.trim()) {
//     alert('Please enter a name for your flashcard set.')
//     return
//   }

 

//     const batch = writeBatch(db)
//     const userDocRef=doc(collection(db, 'users'), user.id)
//     const docSnap=await getDoc(userDocRef)

//     if (docSnap.exists()) {
//       const collections = docSnap.data().flashcards ||[]
//       if (collections.find((f)=>f.name===setName)){
//         alert('Flashcards collection with the same name already exists')
//         return 

//       }
//       else{
//         collection.push({setName})
//         batch.set(userDocRef,{flashcards:collections}, {merge:true})
//       }
//     }
//     else{
//       batch.set(userDocRef,{flashcards:[{setName}]})
//     }
//     const colRef= collection(userDocRef,setName)
//     flashcards.forEach((flashcard)=>{
//       const cardDocRef= doc(colRef)
//       batch.set(cardDocRef, flashcard)
//     })
//     await batch.commit()
//     handleCloseDialog()
//     router.push('/flashcards')
  
//   } 
// return <Container maxWidth="md">
// <Box sx={{ mt: 4, mb:6, display: 'flex', flexDirection:'column', justifyContent: 'center' }}>
//    <Typography variant='h4'>Generate Flashcards</Typography>
//    <Paper sx={{p:4, width:'100%'}}>
//     <TextField value={text}
//     onChange={(e)=>setText(e.target.value)}
//     label ="Enter Text" fullWidth multiline rows={4} variant="outlined" sx={{mb:2,}}></TextField>
//     <Button variant='contained' color='primary' onClick={handleSubmit} fullWidth >Submit</Button>
//    </Paper>
//   </Box>
//   {flashcards.length > 0 && (
//   <Box sx={{ mt: 4 }}>
//     <Typography variant="h5" >
//        Flashcards Preview
//     </Typography>
//     <Grid container spacing={2}>
//       {flashcards.map((flashcard, index) => (
//         <Grid item xs={12} sm={6} md={4} key={index}>
//        <Card>
//         <CardActionArea onClick={()=>{
//           handleCardClick(index)
//         }}>
// <CardContent>
//   <Box sx={{perspective:'100px', 
//   '& > div':{
//     transition:'transform 0.6s',
//     transformStyle:'preserve-3d', 
//     position:'relative',
//     width:'100%',
//     height:'200px',
//     boxShadow:'0 4px 8px 0 rgba (0,0,0,0.2)',
//     transform:flipped[index]? 'rotateY(180deg)':'rotateY(0deg)'
//   },
//   '& > div > div':{
//    position:'absolute',
//     width:'100%',
//     height:'100%',
//     backfaceVisibility:'hidden',
//     display:"flex",
//     justifyContent:'center', 
//     alignItems:'center', 
//     padding:2,
//     boxSizing:'border-box',
//   },
//   '& > div > div:nth-of-type(2)':{
//     transform:'rotateY(180deg)'
//   }
    
//   }}
  
  
  
  
//   >
//     <div> 
    
//       <div> <Typography variant='h5' component="div">{flashcard.front}</Typography> </div> 
//       <div> <Typography variant='h5' component="div">{flashcard.back}</Typography> </div> 
//     </div>
//   </Box>

// </CardContent>
//         </CardActionArea>
//        </Card>
//         </Grid>
//       ))}
//     </Grid>

//     <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
//       <Button variant='contained' color='secondary' onClick={handleOpen}>Save</Button>

//     </Box>
//   </Box>
// )}
// <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//   <DialogTitle>Save Flashcard Set</DialogTitle>
//   <DialogContent>
//     <DialogContentText>
//       Please enter a name for your flashcard set.
//     </DialogContentText>
//     <TextField
//       autoFocus
//       margin="dense"
//       label="Set Name"
//       type="text"
//       fullWidth
//       value={setName}
//       onChange={(e) => setSetName(e.target.value)}
//       variant='outlined'
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleCloseDialog}>Cancel</Button>
//     <Button onClick={saveFlashcards} color="primary">
//       Save
//     </Button>
//   </DialogActions>
// </Dialog>
// </Container>
// }