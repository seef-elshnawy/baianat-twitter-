import { ObjectType, Field } from "@nestjs/graphql";
import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@ObjectType()
@Table({tableName:'Category'})
export class Category extends Model{

    @PrimaryKey
    @Field()
    @Default(DataType.UUIDV4)
    @Column({
        type:DataType.UUID
    })
    id:string
    
    @Field()
    @Column({
        type:DataType.STRING
    })
    category: string
}