// 계정 생성 권한부여
CREATE USER 'sesac'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'sesac'@'localhost';
SELECT User, Host FROM mysql.user;

// 데이터베이스 생성
drop database detalks;
create database detalks character set utf8mb4 collate utf8mb4_unicode_ci;

// 데이터베이스 확인
show databases;
use detalks;

// 테이블 
show tables;

drop table if exists Members;
drop table if exists Questions;
drop table if exists Answers;

desc members;
desc questions;
desc answers;

select * from Members;
select * from questions;
SELECT * from answers;

// 더미데이터 프로시저
DROP PROCEDURE IF EXISTS detalks.insertdumy;

DELIMITER $$
$$
CREATE PROCEDURE detalks.insertdumy()

BEGIN
    DECLARE i INT DEFAULT 1;

    -- Members 테이블에 더미 데이터 삽입
    WHILE i <= 30 DO
        INSERT INTO members (
        member_about, 
        member_a_count, 
        member_created, 
        member_deleted, 
        member_email, 
        member_img, 
        member_isdeleted, 
        member_name, 
        member_pwd, 
        member_q_count, 
        member_reason, 
        member_rep, 
        member_social, 
        member_state, 
        member_summary, 
        member_updated, 
        member_visited)
        VALUES (CONCAT('About member ', i), 
                FLOOR(RAND() * 100), 
                NOW(), 
                NULL, 
                CONCAT('member', i, '@example.com'), 
                CONCAT('img', i, '.jpg'), 
                0, 
                CONCAT('Member', i), 
                CONCAT('password', i), 
                FLOOR(RAND() * 100), 
                NULL, 
                FLOOR(RAND() * 1000), 
                FLOOR(RAND() * 3), 
                0, 
                CONCAT('Summary for member ', i), 
                NOW(), 
                NOW());
        SET i = i + 1;
    END WHILE;

    -- Questions 테이블에 더미 데이터 삽입
    SET i = 1;
    WHILE i <= 30 DO
        INSERT INTO questions (q_created_at, is_solved, q_modified_at, question_content, question_state, question_title, q_view_count, q_vote_count, member_idx)
        VALUES (NOW(), 
                0, 
                NOW(), 
                CONCAT('Content of question ', i), 
                0, 
                CONCAT('Question ', i), 
                FLOOR(RAND() * 1000), 
                FLOOR(RAND() * 100), 
                FLOOR(RAND() * 10) + 1);
        SET i = i + 1;
    END WHILE;

    -- Answers 테이블에 더미 데이터 삽입
    SET i = 1;
    WHILE i <= 30 DO
        INSERT INTO answers (answer_content, answer_state, a_created_at, is_selected, a_modified_at, a_vote_count, member_idx, question_id)
        VALUES (CONCAT('Content of answer ', i), 
                0, 
                NOW(), 
                0, 
                NOW(), 
                FLOOR(RAND() * 100), 
                FLOOR(RAND() * 10) + 1, 
                FLOOR(RAND() * 20) + 1);
        SET i = i + 1;
    END WHILE;
END $$
DELIMITER ;


// 프로시저 실행
CALL detalks.insertdumy();