<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250413123131 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TEMPORARY TABLE __temp__product AS SELECT id, name, describtion, price, created_at, updated_at FROM product
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE product
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE product (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description CLOB DEFAULT NULL, price DOUBLE PRECISION NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)
        SQL);
        $this->addSql(<<<'SQL'
            INSERT INTO product (id, name, description, price, created_at, updated_at) SELECT id, name, describtion, price, created_at, updated_at FROM __temp__product
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE __temp__product
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TEMPORARY TABLE __temp__product AS SELECT id, name, description, price, created_at, updated_at FROM product
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE product
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE product (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, describtion CLOB DEFAULT NULL, price DOUBLE PRECISION NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)
        SQL);
        $this->addSql(<<<'SQL'
            INSERT INTO product (id, name, describtion, price, created_at, updated_at) SELECT id, name, description, price, created_at, updated_at FROM __temp__product
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE __temp__product
        SQL);
    }
}
