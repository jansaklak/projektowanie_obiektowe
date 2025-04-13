<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/product')]
final class ProductController extends AbstractController
{
    #[Route('/', name: 'app_product_index', methods: ['GET'])]
    public function index(ProductRepository $productRepository): Response
    {
        return $this->json([
            'products' => $productRepository->findAll()
        ]);
    }

    #[Route('/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = new Product();

        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);

            $product->setName($data['product']['name'] ?? '');
            $product->setDescription($data['product']['description'] ?? '');
            $product->setPrice($data['product']['price'] ?? 0);
            $product->setCreatedAt(new \DateTimeImmutable());
            $product->setUpdatedAt(new \DateTimeImmutable());

            $entityManager->persist($product);
            $entityManager->flush();

            return $this->json([
                'status' => 'created',
                'product' => $product
            ], Response::HTTP_CREATED);
        }

        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($product);
            $entityManager->flush();

            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_product_show', methods: ['GET'])]
    public function show(Product $product): Response
    {
        return $this->json([
            'product' => $product
        ]);
    }

    #[Route('/{id}/edit', name: 'app_product_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);

            $product->setName($data['product']['name'] ?? $product->getName());
            $product->setDescription($data['product']['description'] ?? $product->getDescription());
            $product->setPrice($data['product']['price'] ?? $product->getPrice());
            $product->setUpdatedAt(new \DateTimeImmutable());

            $entityManager->flush();

            return $this->json([
                'status' => 'updated',
                'product' => $product
            ]);
        }

        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_product_delete', methods: ['DELETE'])]
    public function delete(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);

            if (!$product) {
                return $this->json([
                    'status' => 'error',
                    'message' => 'Produkt nie istnieje.'
                ], Response::HTTP_NOT_FOUND);
            }

            $entityManager->remove($product);
            $entityManager->flush();

            return $this->json([
                'status' => 'deleted',
                'product_id' => $product->getId()
            ]);
        }

        return $this->json([
            'status' => 'error',
            'message' => 'Nieprawidłowy typ danych (expected JSON).'
        ], Response::HTTP_BAD_REQUEST);
    }
}
