export const DescriptionDPImage = () => {

  const divstyle = {
    height: '36vw', 
    width:'50vw',
  };

  const imgstyle = {
    display:'flex',
    paddingTop:'8vw',
    paddingLeft:'5vw',
    width: '40vw'    
  };

  return (
    <div style={divstyle}>
      <img src="./images/DescriptionDPImage.svg" style={imgstyle}></img>
    </div>
  );
};