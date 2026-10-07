const pool = require("./db");

/**
 * Initializes all MySQL database tables for LUMI.
 */
async function initDatabase() {
  console.log("[LUMI DB] Checking and initializing database schema...");

  const queries = [
    // 1. Users Table
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100),
      bio TEXT,
      theme VARCHAR(20) DEFAULT 'light',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 2. Tasks Table
    `CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      priority VARCHAR(20) DEFAULT 'medium',
      completed BOOLEAN DEFAULT FALSE,
      due_date VARCHAR(100) DEFAULT NULL,
      category VARCHAR(100) DEFAULT 'General',
      time VARCHAR(50) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 3. Habits Table
    `CREATE TABLE IF NOT EXISTS habits (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'Daily',
      icon VARCHAR(100) DEFAULT 'Sparkles',
      color VARCHAR(50) DEFAULT '#9E96D8',
      target_days_per_week INT DEFAULT 7,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Habit Completions (Relational tracking)
    `CREATE TABLE IF NOT EXISTS habit_completions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      habit_id VARCHAR(36) NOT NULL,
      completed_date VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_habit_date (habit_id, completed_date),
      CONSTRAINT fk_habit_completions FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 4. Goals Table
    `CREATE TABLE IF NOT EXISTS goals (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'Personal',
      target_date VARCHAR(100) DEFAULT NULL,
      why_it_matters TEXT,
      progress INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'In Progress',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Goal Milestones
    `CREATE TABLE IF NOT EXISTS goal_milestones (
      id VARCHAR(36) PRIMARY KEY,
      goal_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_milestones_goal FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 5. Notes Table
    `CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      content LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Note Tags
    `CREATE TABLE IF NOT EXISTS note_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      note_id VARCHAR(36) NOT NULL,
      tag VARCHAR(100) NOT NULL,
      UNIQUE KEY unique_note_tag (note_id, tag),
      CONSTRAINT fk_tags_note FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 6. Projects Table
    `CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'in-progress',
      deadline VARCHAR(100) DEFAULT NULL,
      progress INT DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Project Subtasks
    `CREATE TABLE IF NOT EXISTS project_subtasks (
      id VARCHAR(36) PRIMARY KEY,
      project_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_subtasks_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 7. Journals / Diary Table
    `CREATE TABLE IF NOT EXISTS journals (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(50) NOT NULL,
      template VARCHAR(100) DEFAULT 'daily',
      mood VARCHAR(100) DEFAULT 'calm',
      entry LONGTEXT,
      gratitude TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_journals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 8. Memories Table
    `CREATE TABLE IF NOT EXISTS memories (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      caption TEXT,
      date VARCHAR(50) DEFAULT NULL,
      location VARCHAR(255) DEFAULT NULL,
      image_url TEXT,
      is_shared BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_memories_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Memory Tags
    `CREATE TABLE IF NOT EXISTS memory_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      memory_id VARCHAR(36) NOT NULL,
      tag VARCHAR(100) NOT NULL,
      CONSTRAINT fk_memory_tags FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Memory Reactions
    `CREATE TABLE IF NOT EXISTS memory_reactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      memory_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      reaction_type VARCHAR(50) NOT NULL,
      UNIQUE KEY unique_memory_user_reaction (memory_id, user_id, reaction_type),
      CONSTRAINT fk_reactions_memory FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE,
      CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Memory Comments
    `CREATE TABLE IF NOT EXISTS memory_comments (
      id VARCHAR(36) PRIMARY KEY,
      memory_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comments_memory FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE,
      CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 9. Books / Reading Tracker Table
    `CREATE TABLE IF NOT EXISTS books (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) DEFAULT 'Unknown Author',
      cover TEXT,
      status VARCHAR(50) DEFAULT 'want_to_read',
      total_pages INT DEFAULT 300,
      current_page INT DEFAULT 0,
      rating INT DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_books_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 10. Conversations Table
    `CREATE TABLE IF NOT EXISTS conversations (
      id VARCHAR(36) PRIMARY KEY,
      last_message TEXT,
      last_timestamp VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Conversation Participants
    `CREATE TABLE IF NOT EXISTS conversation_participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      conversation_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      UNIQUE KEY unique_conv_user (conversation_id, user_id),
      CONSTRAINT fk_cp_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
      CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // Messages Table
    `CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(36) PRIMARY KEY,
      conversation_id VARCHAR(36) NOT NULL,
      sender_id VARCHAR(36) NOT NULL,
      text TEXT,
      media_url TEXT,
      timestamp VARCHAR(50),
      read_status BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
      CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    // 11. Focus Sessions Table
    `CREATE TABLE IF NOT EXISTS focus_sessions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      task_id VARCHAR(36) DEFAULT NULL,
      mode VARCHAR(30) DEFAULT 'focus',
      duration_minutes INT NOT NULL,
      tag VARCHAR(100) DEFAULT 'Deep Work',
      notes TEXT DEFAULT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_focus_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      CONSTRAINT fk_focus_task FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  ];

  for (const q of queries) {
    await pool.query(q);
  }

  // Ensure tasks due_date column is VARCHAR(100) and memories image_url is LONGTEXT
  try {
    await pool.query("ALTER TABLE tasks MODIFY COLUMN due_date VARCHAR(100) DEFAULT NULL;");
  } catch (err) {
    // Column might already be modified
  }

  try {
    await pool.query("ALTER TABLE memories MODIFY COLUMN image_url LONGTEXT;");
  } catch (err) {
    // Column might already be modified
  }

  console.log("[LUMI DB] All tables verified and ready.");
}

module.exports = { initDatabase };
