import styled from 'styled-components';

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  width: 100%;        /* Ensures wrapper fills available width */
  max-width: none;    /* Remove max-width constraint if exists */
  background-color: transparent;

  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 1000px; /* Increased maximum width */
    width: 100%; /* Ensure the form takes full width up to the max-width */
    padding: 20px;
    border-radius: 20px;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .message {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .form-group {
    position: relative;
  }

  .form-group.full-width {
    grid-column: 1 / -1; /* Makes the element take up two columns */
  }

  .form-group .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 5px 5px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form-group .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form-group .input:focus + span,
  .form-group .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    background-color: #00bfff;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: #00bfff96;
  }
  .form-group .input.notes-textarea {
  width: 100%; // Use a fixed width for testing
  max-width: 8000px;
}

  .custom-dropdown {
    position: relative;
    width: 100%;
  }

  .dropdown-button {
    width: 100%;
    text-align: left;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    color: #fff;
    cursor: pointer;
    height: auto;
    padding: 10px 5px 5px 10px;
    min-height: 50px;
    white-space: normal;
    word-wrap: break-word;
  }

  .custom-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    margin-top: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Creates three columns of equal width */
    gap: 8px; /* Adds space between the columns and rows */
  }

  .close-dropdown {
    padding: 8px 8px;
    background-color: #00bfff; /* Matching the dropdown background color */
    color: #fff;
    border: none;
    cursor: pointer;
    grid-column: span 3; /* Makes the button span all three columns */
  }


  .custom-dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #fff;

    &:hover {
      background-color: #444;
    }

    input[type="checkbox"],
    input[type="radio"] {
      margin-right: 8px;
    }

    .checkbox-label,
    .radio-label {
      flex: 1;
    }
  }

  /* Scrollbar styling for the dropdown menu */
  .custom-dropdown-menu::-webkit-scrollbar {
    width: 8px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb {
    background: #00bfff;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: #00bfff96;
  }

  .dropdown-label {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.5);
  }

  .notes-label {
    display: block;
    margin-bottom: 7px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.5em;
    font-weight: 600;
  }


  .textarea-input {
    resize: none;
    min-height: 120px;
    padding-top: 5px !important;
    line-height: 1.5;
    font-family: inherit;
  }

  .textarea-input::placeholder {
    opacity: 0.7;
    font-size: 1.5em;
  }
`;

export const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.05);
`;
