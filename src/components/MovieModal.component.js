import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const MovieModal = ({ movie }) => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [modalState, setIsModalState] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if(isFetching){     
        getCharactersOfMovie();
      }    
    },[isFetching]);

    const getUrls = (characters) => {
        return characters.map((character) => axios.get(character));
      };

    const getCharactersOfMovie = () => {
        Promise.all(getUrls(movie.characters)).then((data) => {
        console.log(data)
          setCharacters(data);
          setIsLoading(false);
        });
        
      };

    const handleOpen = async () => {
        setIsModalState(true);
        setIsFetching(true);
    };
    
    const handleClose = () => {
        setIsModalState(false);
    };

    const CharactersList = ({ characters, numberCharacters }) => {
      const arr = characters.slice(0, numberCharacters);

      return(
        <div>
          <h3>Main Characters:</h3>
          {
          arr.map(character => <h4 key={`${character.name}${movie.id}`}>{character.name}</h4>)
          }
        </div>
      )
    }

    return (
        <div>
          <button type="button" onClick={handleOpen}>
            See Details
          </button>
          <Modal
            open={modalState}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {
              <div style={modalStyle} className={classes.paper}>
                <h3>Title: {movie.title}</h3>
                <h3>Director: {movie.director}</h3>
                <h3>Producer: {movie.producer}</h3>
                <h4>{movie.opening_crawl}</h4>
                {isLoading ? 'Loading...' : 
                (
                    <>
                      {characters.map((character) => (
                        <Chip color="secondary" label={character.data.name} />
                      ))}
                    </>
                  )}
              </div>
            }
          </Modal>
        </div>
    );
}

export default MovieModal;