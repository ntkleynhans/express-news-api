import React, { Component } from 'react';


class App extends Component {
  state = { stories: [] }

  componentDidMount() {
    fetch("http://192.168.8.145:3000/topstories")
    .then(response => response.json())
    .then(json => {
      console.log(json);
      this.setState({ stories: json });
    })
    .catch(error => alert(error.message))
  }

  render() {
    return(
      <div>
        <h2>Latest Hacker News</h2>
        {
          this.state.stories.map(story => {
            return (
              <div key={story.id} className="card" style={{ margin: 10 }}>
                <div className="card-body">
                  <h5 className="card-title">{story.title}</h5>
                  <p>by</p>
                  <h6 className="card-subtitle mb-2 text-muted"><em>{story.by} - ({new Date(story.time).toLocaleTimeString()})</em></h6>
                  <p className="card-text">Upvotes: {story.score} </p>
                  <a href="{story.url}" className="card-link">{story.url}</a>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default App;
