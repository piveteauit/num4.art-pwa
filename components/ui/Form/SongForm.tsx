"use client";
import { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import Input from "./Input/Input";
import { addSong } from "@/libs/server/song.action";
import { usePlayer } from "@/context/PlayerContext";
import { uploadToS3 } from "@/libs/uploadFile";

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
  const [genre, setGenre] = useState(["1"]);

  const onSubmit = async () => {
    setStatus("Upload du son...");
    const data = {
      audio: await uploadToS3(values.audio, `songs/full-${user?.profile?.id}`),
      preview: await uploadToS3(
        values.preview,
        `songs/preview-${user?.profile?.id}`
      ),
      image: await uploadToS3(values.image, `songs/cover-${user?.profile?.id}`)
    };

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
      genres: genre
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
            onChange={() => setValues({ ...values })}
          >
            <option value={"0"} disabled selected={!values?.genre?.length}>
              {"Sélectionner un genre"}
            </option>
            <option onClick={() => setGenre(["1"])} value={"1"}>
              {" "}
              {"Rap"}
            </option>
            <option onClick={() => setGenre(["2"])} value={"2"}>
              {" "}
              {"Rock"}
            </option>
            <option onClick={() => setGenre(["3"])} value={"3"}>
              {" "}
              {"Techno"}
            </option>
            <option onClick={() => setGenre(["4"])} value={"4"}>
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
            (!values?.genre?.length && !genre?.length) ||
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
