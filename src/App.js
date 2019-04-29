import React, {Component} from 'react';
import withFetch from './components/withFetch';
import {RundomPostBtn} from './components/RundomPostBtn';
import Modal from './components/Modal';

import './App.css';

function Posts(props) {
  let {data, id, showModal, user, comments} = props
  let userRef = React.createRef();
  let commentsRef = React.createRef();

  let showUser = () => showModal(userRef.current.value, userRef.current.getAttribute('userid'));
  let showComments = () => showModal(commentsRef.current.value);

  return (
    <React.Fragment>
      {data.id !== undefined
        ? (
          <div className="cardPost">
            <h2>{data.title}</h2>
            <p>{data.body}</p>
            <div className="center">
              <button onClick={showUser} ref={userRef} value="showUser" userid={data.userId}>
                {!user
                  ? 'Show '
                  : 'Hide '}
                User for Post
              </button>
              <button onClick={showComments} ref={commentsRef} value="showComments">
                {!comments
                  ? 'Show '
                  : 'Hide '}
                Comments for Post
              </button>
            </div>
          </div>
        )
        : (
          <div className="center">
            <h1>No post by Id = {id}.</h1>
          </div>
        )}
    </React.Fragment>
  );
};

function User(props) {
  return (
    <React.Fragment>
      {props.data.name !== undefined
        ? (
          <div className="cardUser">
            <h1>{props.data.name}</h1>
            <p>Email: {props.data.email}</p>
            <b>Address:</b>
            <address>
              {props.data.address.city}<br/>{props.data.address.street}<br/>{props.data.address.suite}<br/>{props.data.address.zipcode}<br/>
            </address>
          </div>
        )
        : (
          <div className="cardUser">
            <h1>User not found.</h1>
          </div>
        )}

    </React.Fragment>
  );
};

function Comments(props) {
  let tenComments = props
    .data
    .filter((comment, index) => index < 10
      ? comment
      : null);
  return (
    <React.Fragment>
      {tenComments.length > 0
        ? (
          <div className="cardComments">
            <h1>Comments</h1>
            <ul>
              {tenComments.map(comment => <li key={comment.id}>{comment.name}</li>)}
            </ul>
          </div>
        )
        : (
          <div className="cardComments">
            <h1>Comments</h1>
            <p>No comments</p>
          </div>
        )}
    </React.Fragment>
  );
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      postId: 1,
      userId: 0,
      showUser: false,
      showComments: false
    };
  };

  rundomPost = () => {
    this.setState(({postId, showUser, showComments}) => ({
      postId: Math.trunc(1 + Math.random() * (100 - 1)),
      showUser: false,
      showComments: false
    }));
  };

  showModal = (type, payload = undefined) => {
    if (type === 'showUser') {
      this.setState(({showUser, userId}) => ({
        showUser: !showUser,
        userId: payload
      }));
    } else if (type === 'showComments') {
      this.setState(({showComments}) => ({
        showComments: !showComments
      }));
    };
  };

  render() {
    const {postId, userId, showUser, showComments} = this.state;
    let EnhancedPosts,
      EnhancedComments,
      EnhancedUser;

    if (postId) {
      EnhancedPosts = withFetch('posts', `/${postId}`)(Posts);
    };

    if (postId) {
      EnhancedComments = withFetch('comments', `?postId=${postId}`)(Comments);
    };

    if (userId) {
      EnhancedUser = withFetch('users', `/${userId}`)(User);
    };

    return (
      <React.Fragment>
        <div className="center">
          <RundomPostBtn onClick={this.rundomPost}/>
        </div>
        <EnhancedPosts
          id={postId}
          showModal={this.showModal}
          user={showUser}
          comments={showComments}/> {showUser && !!userId && (
          <Modal>
            <EnhancedUser/>
          </Modal>
        )}
        {showComments && !!postId && (
          <Modal>
            <EnhancedComments/>
          </Modal>
        )}
      </React.Fragment>
    );
  }
};