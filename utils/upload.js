import multer from 'multer'
import path from 'path'
const __dirname = path.resolve()

const filename = (req, file, next)=>{
  let lastIndexof = file.originalname.lastIndexOf('.')
  let ext = file.originalname.substring(lastIndexof)
  next(null, `img-${Date.now()}${ext}`)
}

const destination = (req, file, next)=> {
      next(null, './public/uploads')
    }
  
const upload = multer({
    storage: multer.diskStorage({ filename, destination}),
    limits: { fileSize: 1024 * 1204 * 5 },
  })

  export default upload