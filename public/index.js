var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleCommentSubmit: function(comment) {
  	$.ajax({
  		url: this.props.url, 
  		dataType: 'json', 
  		type: 'POST', 
  		data: comment, 
  		success: function(data) {
  			this.setState({data: data});
  		}.bind(this), 
  		error: function(xhr, status, err) {
  			console.error(this.props.url, status, err.toString()); 
  		}.bind(this)
  	});
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var Comment = React.createClass({
	render: function() {
		return (
				<div className="comment row">
					<div className="col-md-2 col-sm-2">
						<i className="fa fa-user fa-2x"></i>
					</div>
					<div className="col-md-9 col-sm-9">
						<h3 className="commentAuthor">
							{this.props.author}
						</h3>
							{this.props.children}
					</div>
					<div className="col-md-1 col-sm-1">
						<i className="fa fa-minus-circle"></i>
					</div>
				</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault(); 
		var author = React.findDOMNode(this.refs.author).value.trim(); 
		var text = React.findDOMNode(this.refs.text).value.trim(); 
		if (!text || !author) {
			return; 
		}
		this.props.onCommentSubmit({author:author, text: text}); 
		React.findDOMNode(this.refs.author).value = ''; 
		React.findDOMNode(this.refs.text).value = ''; 
		return; 
	},

	render: function() {
		return (
			<div className="row">
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder= "Your Name" ref="author" />
				<input type="text" placeholder= "Say something..." ref="text" />
				<input type="submit" value="Post" /> 
			</form>
			</div>
		);
	}
});

React.render(
	<CommentBox url="comments.json" pollInterval={2000} />,
	document.getElementById('mount-point') 
)