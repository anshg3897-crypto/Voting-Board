# 📝 Notevo — Feature Requests Board

Notevo is a simple web-based feature request system where users can submit ideas, vote on them, and track their progress. It is designed to simulate how real products collect feedback and prioritize features.

The application has three main sections: Feature Requests, Roadmap, and Changelog. These sections are accessible through the navigation bar and switch dynamically without reloading the page.

In the Feature Requests section, users can submit new feature ideas by providing a title, description, and an optional tag. Each feature is displayed as a card where users can upvote it. The system prevents duplicate submissions and ensures that features are sorted based on the number of votes, helping highlight the most important ideas.

The Roadmap section organizes all features based on their current status, such as "Under Review", "In Progress", and "Planned". This helps users understand what stage each feature is in and how the product is evolving.

The Changelog section provides a complete list of all features along with their statuses. It acts as a history log, allowing users to track updates and changes over time.

The entire application is built using HTML, CSS, and JavaScript. It uses the browser's localStorage to store feature data and votes, so the data persists even after refreshing the page.

Overall, Notevo demonstrates a basic product feedback system with interactive UI, dynamic rendering, and client-side data management.

