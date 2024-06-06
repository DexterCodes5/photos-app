import { useState, useEffect } from "react"
import axios from "axios"
import { PhotoForm } from "./PhotoForm"

export const HomePage = () => {
    const [photos, setPhotos] = useState([])
    const [totalPhotos, setTotalPhotos] = useState(0)
    const [page, setPage] = useState(1)
    const [showForm, setShowForm] = useState(false)
    const [id, setId] = useState(null)
    const [getPhotos, setGetPhotos] = useState(false)

    useEffect(() => {
        const getPhotos = async () => {
            try {
                const res = await axios.get(`http://localhost:3500/photos?page=${page}`)
                setPhotos(res.data.photos)
                setTotalPhotos(res.data.total)
            } catch (err) {
                console.error(err)
            }
        }

        getPhotos()
    }, [page, getPhotos])

    const deletePhoto = async (id) => {
        await axios.delete(`http://localhost:3500/photos/${id}`)
        setGetPhotos(prevVal => !prevVal)
    }

    const shouldIShowNextPage = () => {
        const lastIdx = page * 6
        if (totalPhotos > lastIdx) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className="container">
            <h1>Photos</h1>
            {photos.length === 0 ?
                <h2>Sorry no Photos</h2>
                :
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Photo</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {photos.map(photo =>
                                <tr key={photo._id}>
                                    <td>{photo.title}</td>
                                    <td>{photo.description}</td>
                                    <td>
                                        <img src={photo.url}></img>
                                    </td>
                                    <td>
                                        <button className="btn update-btn"
                                            onClick={() => {
                                                setShowForm(true)
                                                setId(photo._id)
                                            }}>
                                            Update
                                        </button>
                                        <button className="btn delete-btn"
                                            onClick={() => deletePhoto(photo._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pages">
                        <p>Page {page}</p>
                        {page > 1 &&
                            <button className="btn update-btn" onClick={() => setPage(page - 1)}>Previous Page</button>
                        }
                        {shouldIShowNextPage() &&
                            <button className="btn update-btn" onClick={() => setPage(page + 1)}>Next Page</button>
                        }
                    </div>
                    <button className="btn update-btn" onClick={() => {
                        setShowForm(true)
                        setId(null)
                    }}>
                        Add new photo
                    </button>
                    {showForm &&
                        <PhotoForm id={id} setShowForm={setShowForm} setGetPhotos={setGetPhotos} />
                    }
                </>
            }

        </div>
    )
}