"use client";
import { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import Input from "./Input/Input";
// import { uploadSong } from "@/libs/s3";
import apiClient from "@/libs/api";
import { addSong } from "@/libs/server/song.action";
import ReactStudio from "react-studio-js";
import { usePlayer } from "@/context/PlayerContext";

const defaultValues: any = {
  price: 0,
  title: "",
  description: "",
  album: [],
  genre: [],
  feat: [],
  audio: null,
  preview: null,
  image: null
};

function SongForm({ user }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchSongs } = usePlayer();
  const [status, setStatus] = useState("");
  const [values, setValues] = useState(defaultValues);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [genre, setGenre] = useState("");

  const onSubmit = async () => {
    setStatus("Upload du son...");

    const formData = new FormData();

    formData.append("audio", values.audio);
    formData.append("preview", values.audio);
    formData.append("image", values.image);
    formData.append("prefix", `songs/${user?.profile?.id}`);

    const { data } = await apiClient.post("/upload/song", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }); //uploadSong({ image: null, audio: await evt.target.files[0].arrayBuffer() })

    console.log({
      ...values,
      ...data
    });

    setStatus("Finalisation du morceau");
    const { title, price, description } = values;
    //title, price, genres, albums, description, image, audio, artists
    const newSong = await addSong({
      title,
      price,
      description,

      image: data?.image?.url,
      audio: data?.audio?.url,

      preview: data?.preview?.url,

      artists: user?.profile?.artist?.id ? [user?.profile?.artist?.id] : [],
      genres: genre ? [genre] : []
    });

    setStatus("Terminé");

    await fetchSongs();

    setIsModalOpen(false);
    setValues(defaultValues);
    setStatus("");
  };

  return (
    <div className={`${user?.profile?.artistMode ? "" : "invisible"}`}>
      <div className="w-full text-center mb-5">
        <Button
          onClick={() => setIsModalOpen(true)}
          className={`${user?.profile?.artistMode ? "" : "hidden"}`}
        >
          {"Publier un titre"}
        </Button>
      </div>

      <Modal {...{ isModalOpen, setIsModalOpen, title: "Ajouter une musique" }}>
        <div className="my-4 border-2 flex flex-col gap-4 border-primary p-2 rounded-lg">
          <Input
            label="Titre"
            type="text"
            onChange={({ target }) =>
              setValues({ ...values, title: target.value })
            }
          />

          <Input
            label="Prix"
            type="number"
            onChange={({ target }) =>
              setValues({ ...values, price: Number(target.value) })
            }
          />

          <Input
            onChange={({ target }) =>
              setValues({ ...values, description: target.value })
            }
            label="Description"
            type="textarea"
          />
        </div>

        <div className="my-4 border-2 flex flex-col gap-4 border-primary p-2 rounded-lg">
          <Input
            label="Son"
            type="file"
            accept="audio/*"
            onChange={(evt) => {
              setValues({ ...values, audio: evt.target.files[0] });
            }}
          />
          <Input
            label="Preview"
            type="file"
            accept="audio/*"
            onChange={(evt) => {
              setValues({ ...values, preview: evt.target.files[0] });
            }}
          />
          <Input
            label="Image"
            type="file"
            accept="image/*"
            onChange={(evt) =>
              setValues({ ...values, image: evt.target.files[0] })
            }
          />
        </div>

        <div className="my-4 border-2 flex flex-col gap-4 border-primary p-2 rounded-lg">
          <select
            className="select select-primary bg-base  border-0 outline-0 focus:border-0 focus:outline-0 border-b-2 w-full max-w-xs"
            onChange={() => setValues({ ...values, genre: ["1"] })}
          >
            <option value={"0"} disabled selected={!values?.genre?.length}>
              {"Sélectionner un genre"}
            </option>
            <option onClick={() => setGenre("1")} value={"1"}>
              {" "}
              {"Rap"}
            </option>
            <option onClick={() => setGenre("2")} value={"2"}>
              {" "}
              {"Rock"}
            </option>
            <option onClick={() => setGenre("3")} value={"3"}>
              {" "}
              {"Techno"}
            </option>
            <option onClick={() => setGenre("4")} value={"4"}>
              {" "}
              {"House"}
            </option>
          </select>
        </div>

        <Button
          disabled={
            !!loadingMessage ||
            !values?.price ||
            !values?.title ||
            !values?.genre?.length ||
            !values?.image ||
            !values?.audio ||
            !!status
          }
          onClick={onSubmit}
          className="w-full my-3"
        >
          {status || "Valider"}
        </Button>

        {/* 
        <div className="my-2 border-2 border-primary p-2 rounded-lg">
          <select>
            <option value={"0"}> {"Sélectionner un album"}</option>
            <option value={"1"}> {"Alb 1"}</option>
            <option value={"2"}> {"Alb 2"}</option>
            <option value={"3"}> {"Alb 3"}</option>
            <option value={"4"}> {"Alb 4"}</option>
          </select>
        </div> */}
      </Modal>
    </div>
  );
}

export default SongForm;
