function Loading({ cover }) {
    return (
        <>
            {cover && (
                <div className="container">
                    <div className="row">
                        <div className="col-12 py-5 text-center">
                            <div className="lds-ripple">
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!cover && (
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            )}
        </>
    );
}

export default Loading;
