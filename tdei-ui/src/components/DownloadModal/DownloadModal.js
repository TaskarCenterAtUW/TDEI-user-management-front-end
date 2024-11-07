import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';

const DownloadModal = ({
    show,
    handleClose,
    handleDownload,
    formatOptions,
    fileVersionOptions,
    selectedFormat,
    setSelectedFormat,
    selectedFileVersion,
    setSelectedFileVersion,
    isLoading,
    isReleasedDataset = false
}) => {
    // Set default format as 'osw' and file version as 'latest'
    const defaultFormat = { value: 'osw', label: 'OSW' };
    const defaultFileVersion = { value: 'latest', label: 'Latest' };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton={!isLoading}> 
                <Modal.Title>OSW Dataset Download</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Select Format</Form.Label>
                    <Select
                        options={formatOptions}
                        onChange={(option) => setSelectedFormat(option)}
                        value={selectedFormat || defaultFormat}
                        isDisabled={isLoading} 
                    />
                    <div className="tdei-hint-text">(File format to download. Default to osw.)</div>
                </Form.Group>
                {/* {!isReleasedDataset && (
                <Form.Group className="mt-3">
                    <Form.Label>Select File Version</Form.Label>
                    <Select
                        options={fileVersionOptions}
                        onChange={(option) => setSelectedFileVersion(option)}
                        value={selectedFileVersion || defaultFileVersion}
                        isDisabled={isLoading} 
                    />
                     <div className="tdei-hint-text">(The Latest version includes recent modifications; the Original version is the initial upload.)</div>
                </Form.Group> )} */}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    onClick={handleClose}
                    disabled={isLoading} 
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    className="tdei-primary-button"
                    onClick={handleDownload}
                    disabled={isLoading} 
                >
                    {isLoading ? <Spinner size="sm" /> : "Download"} 
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;
