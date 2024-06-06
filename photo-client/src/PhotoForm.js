import { useEffect, useState } from "react"
import axios from "axios"

export const PhotoForm = (props) => {
    const [photo, setPhoto] = useState({ _id: null, title: "", description: "", url: "" })
    const [error, setError] = useState("")

    useEffect(() => {
        const getPhoto = async () => {
            if (!props.id) {
                return
            }
            const res = await axios.get(`http://localhost:3500/photos/${props.id}`)
            setPhoto(res.data)
        }

        getPhoto()
    }, [])

    const changePhoto = (e) => {
        const { name, value } = e.target
        setPhoto({ ...photo, [name]: value })
    }

    const submit = async (e) => {
        e.preventDefault()

        if (!photo.title || !photo.description || !photo.url) {
            setError("Required fields are not populated")
            return
        }

        if (props.id) {
            await axios.put(`http://localhost:3500/photos/${props.id}`, photo)
        } else {
            await axios.post(`http://localhost:3500/photos`, photo)
        }
        props.setShowForm(false)
        props.setGetPhotos(prevVal => !prevVal)
    }

    return (
        <div className="photo-form-background">
            <div className="photo-form-modal">
                <h1>Photo Form</h1>
                <form onSubmit={submit}>
                    <h3>Title</h3>
                    <input type="text" name="title" value={photo.title} onChange={changePhoto}></input>
                    <h3>Descirption</h3>
                    <input type="text" name="description" value={photo.description}
                        onChange={changePhoto}></input>
                    <h3>Url</h3>
                    <input type="text" name="url" value={photo.url} onChange={changePhoto}></input>
                    {error &&
                        <div className="error">{error}</div>
                    }
                    <button className="btn update-btn" style={{ marginTop: "1rem" }}>
                        Submit
                    </button>
                    <button className="btn delete-btn" onClick={() => props.setShowForm(false)}>Close</button>
                </form>
            </div>
        </div>
    )
}